const fetchInterceptor = function () {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    const endpointName = ((args[0] instanceof Request) ? args[0]?.url : args[0]) || 'ignore';

    try {
      const clone = response.clone();
      const data = await clone.json();

      window.postMessage(
        {
          source: 'tm-fetch-hook',
          url: args[0],
          endpoint: endpointName,
          data,
        },
        '*'
      );
    } catch (e) {
      // не JSON — игнорируем
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
