export function initImagePipeline(): void {
  window.addEventListener('message', (event: MessageEvent) => {
    const { type, blobID, blob } = event.data ?? {};

    if (type !== 'image-request') return;

    const normalizedData = blob;

    window.postMessage(
      {
        type: 'image-ready',
        blobID,
        normalizedData,
        endpoint: 'ignore'
      },
      '*'
    );
  });
}

initImagePipeline();
