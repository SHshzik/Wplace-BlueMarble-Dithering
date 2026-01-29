import parseEndpoint from "./endpoint.ts";

export default (endpointName: string, cb: (event: MessageEvent) => void) => {
  window.addEventListener('message', async (event) => {
    const endpointText = parseEndpoint(event.data.endpoint);

    if (endpointText === endpointName) {
      cb(event)
    }
  });
}
