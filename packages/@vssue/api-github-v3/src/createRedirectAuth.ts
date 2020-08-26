import type { VssueAPI } from '@vssue/core';
import { buildURL, concatURL } from '@vssue/utils';

/**
 * Redirect to the authorization page of platform.
 *
 * @see https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity
 */
export const createRedirectAuth = ({
  baseURL,
  clientId,
  state,
}: {
  baseURL: string;
  clientId: string;
  state: string;
}): VssueAPI.VssueAPI['redirectAuth'] => () => {
  window.location.href = buildURL(concatURL(baseURL, 'login/oauth/authorize'), {
    client_id: clientId,
    redirect_uri: window.location.href,
    scope: 'public_repo',
    state,
  });
};
