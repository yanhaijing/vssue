import type { VssueAPI, VssueOptions } from '@vssue/core';
import { concatURL } from '@vssue/utils';
import type { VssueRequest } from '@vssue/utils';
import type { ResponseAccessToken } from './types';

/**
 * Get user access token via `code`
 *
 * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github
 */
export const createGetAccessToken = ({
  baseURL,
  clientId,
  clientSecret,
  request,
  proxy,
}: {
  baseURL: string;
  clientId: string;
  clientSecret: string;
  request: VssueRequest;
  proxy: VssueOptions['proxy'];
}) => async ({ code }: { code: string }): Promise<VssueAPI.AccessToken> => {
  /**
   * access_token api does not support cors
   * @see https://github.com/isaacs/github/issues/330
   */
  const originalURL = concatURL(baseURL, 'login/oauth/access_token');
  const proxyURL = typeof proxy === 'function' ? proxy(originalURL) : proxy;
  const { data } = await request<ResponseAccessToken>(proxyURL, {
    method: 'POST',
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      /**
       * useless but mentioned in docs
       */
      // redirect_uri: window.location.href,
      // state: this.state,
    }),
    headers: [
      ['Accept', 'application/json'],
      ['Content-Type', 'application/json'],
    ],
  });
  return data?.access_token || null;
};
