import type { VssueAPI } from '@vssue/core';
import { buildURL, getCleanURL, parseQuery } from '@vssue/utils';
import type { createGetAccessToken } from './createGetAccessToken';

/**
 * Handle authorization.
 *
 * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
 *
 * @remarks
 * If the `code` and `state` exist in the query, and the `state` matches, remove them from query, and try to get the access token.
 */
export const createHandleAuth = ({
  state,
  getAccessToken,
}: {
  state: string;
  getAccessToken: ReturnType<typeof createGetAccessToken>;
}): VssueAPI.VssueAPI['handleAuth'] => async () => {
  const query = parseQuery(window.location.search);
  if (query.code) {
    if (query.state !== state) {
      return null;
    }
    const { code } = query;
    delete query.code;
    delete query.state;
    const replaceURL =
      buildURL(getCleanURL(window.location.href), query) + window.location.hash;
    window.history.replaceState(null, '', replaceURL);
    const accessToken = await getAccessToken({ code });
    return accessToken;
  }
  return null;
};
