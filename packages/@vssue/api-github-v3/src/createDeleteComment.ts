import type { VssueAPI } from '@vssue/core';
import type { VssueRequest } from '@vssue/utils';

/**
 * Delete a comment
 *
 * @see https://developer.github.com/v3/issues/comments/#delete-a-comment
 */
export const createDeleteComment = ({
  repo,
  owner,
  request,
}: {
  repo: string;
  owner: string;
  request: VssueRequest;
}): VssueAPI.VssueAPI['deleteComment'] => async ({
  accessToken,
  commentId,
}: {
  accessToken: VssueAPI.AccessToken;
  issueId: string | number;
  commentId: string | number;
}): Promise<boolean> => {
  const { status } = await request(
    `repos/${owner}/${repo}/issues/comments/${commentId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `token ${accessToken}` },
    },
  );
  return status === 204;
};
