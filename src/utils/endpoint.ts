const defaultEndpoint: string = 'ignore';

export default (url: string): string => {
  return url
    .split('?')[0]
    .split('/')
    .filter((s: string) => s && isNaN(Number(s)))
    .filter((s: string) => s && !s.includes('.'))
    .pop() || defaultEndpoint;
}
