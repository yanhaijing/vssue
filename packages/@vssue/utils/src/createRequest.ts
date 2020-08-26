import { concatURL } from './concatURL';
import { createRequestError } from './createRequestError';

export type ResponseWithData<T = unknown> = { data: T } & Response;

export type VssueRequest = <T = unknown>(
  url: string,
  options?: RequestInit,
) => Promise<ResponseWithData<T>>;

export type VssueRequestPreHandler = (
  res: ResponseWithData,
) => unknown | Promise<unknown>;

/**
 * Default pre-handler, which will throw the error response
 */
const defaultPreHandler: VssueRequestPreHandler = (response) => {
  // throw error response
  if (!response.ok) {
    throw createRequestError(response);
  }
  return response;
};

/**
 * Create request util - wrapper of fetch API
 */
export const createRequest = ({
  baseURL,
  preHandler = defaultPreHandler,
}: {
  baseURL: string;
  preHandler?: VssueRequestPreHandler;
}): VssueRequest => async <T = unknown>(
  url: string,
  options?: RequestInit,
): Promise<ResponseWithData<T>> => {
  // process url
  const isAbsoluteUrl = /^(https?:)?\/\//.test(url);
  const requestUrl = isAbsoluteUrl ? url : concatURL(baseURL, url);

  // fetch and get response
  const response = (await fetch(requestUrl, options)) as ResponseWithData;

  try {
    response.data = await response.json();
  } catch {
    // noop
  }

  return preHandler(response) as ResponseWithData<T>;
};
