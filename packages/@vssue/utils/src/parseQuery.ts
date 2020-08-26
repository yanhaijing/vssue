export const parseQuery = (query: string): Record<string, string> =>
  Object.fromEntries(
    query
      .replace(/^\?/, '')
      .split('&')
      .map((item) => item.split('=')),
  );
