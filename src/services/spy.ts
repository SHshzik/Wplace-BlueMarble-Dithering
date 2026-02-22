const fetchInterceptor = function () {
  const pendingResolvers = new Map<string, (normalizedData: Blob) => void>();
  window.addEventListener('message', (event: MessageEvent) => {
    const { type, blobID, normalizedData } = event.data ?? {};

    if (type !== 'image-ready') return;

    const resolve = pendingResolvers.get(blobID);
    if (resolve) {
      resolve(normalizedData);
      pendingResolvers.delete(blobID);
    }
  });

  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const endpointName = ((args[0] instanceof Request) ? args[0]?.url : args[0]) as string || 'ignore';
    const clone = response.clone();

    const contentType = clone.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        const data = await clone.json();
        window.postMessage({ endpoint: endpointName, data }, '*');
      } catch (e) {
        // ignore
      }
    } else if (contentType.includes('image/') && !endpointName.includes('openfreemap') && !endpointName.includes('maps')) {
      try {
        const data = await clone.blob();

        return new Promise<Response>((resolve) => {
          const blobID = crypto.randomUUID();

          pendingResolvers.set(blobID, (normalizedData: Blob) => {
            resolve(
              new Response(normalizedData, {
                headers: clone.headers,
                status: clone.status,
                statusText: clone.statusText,
              })
            );
          });

          window.postMessage(
            {
              type: 'image-request',
              blobID,
              blob: data,
              endpoint: endpointName,
            },
            '*'
          );
        });
      } catch (e) {
        // ignore
      }
    }

    return response;
  };
}

function injectScript(fn: () => void) {
  const script = document.createElement('script');
  script.textContent = `(${fn.toString()})();`;
  document.documentElement.appendChild(script);
  script.remove();
}

injectScript(fetchInterceptor);
