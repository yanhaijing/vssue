import type { ResponseWithData } from './createRequest';

export interface VssueRequestError extends Error {
  response: ResponseWithData;
}

export const createRequestError = (
  response: ResponseWithData,
  error: Error = new Error(),
): VssueRequestError => {
  (error as VssueRequestError).response = response;
  return error as VssueRequestError;
};
