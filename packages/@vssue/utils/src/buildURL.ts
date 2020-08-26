import { buildQuery } from './buildQuery';

export const buildURL = (
  cleanURL: string,
  params: Record<string, string | number>,
): string => {
  const query = buildQuery(params);
  return `${cleanURL}?${query}`;
};
