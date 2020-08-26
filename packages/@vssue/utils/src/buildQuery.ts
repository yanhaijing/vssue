export const buildQuery = (params: Record<string, string | number>): string =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
