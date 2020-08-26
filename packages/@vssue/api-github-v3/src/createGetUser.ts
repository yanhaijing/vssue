import type { VssueAPI } from '@vssue/core';
import type { VssueRequest } from '@vssue/utils';
import type { ResponseUser } from './types';
import { normalizeUser } from './utils';

/**
 * Get the logged-in user with access token.
 *
 * @see https://developer.github.com/v3/users/#get-the-authenticated-user
 */
export const createGetUser = ({
  request,
}: {
  request: VssueRequest;
}): VssueAPI.VssueAPI['getUser'] => async ({
  accessToken,
}: {
  accessToken: VssueAPI.AccessToken;
}) => {
  const { data } = await request<ResponseUser>('user', {
    method: 'GET',
    headers: [['Authorization', `token ${accessToken}`]],
  });
  return normalizeUser(data);
};
