import type { VssueAPI } from '@vssue/core';
import type { VssueRequest } from '@vssue/utils';

/**
 * Delete a reaction of a comment
 *
 * @see https://developer.github.com/v3/reactions/#delete-a-reaction
 */
export const createDeleteCommentReaction = ({
  repo,
  owner,
  request,
}: {
  repo: string;
  owner: string;
  request: VssueRequest;
}) => async ({
  accessToken,
  commentId,
  reactionId,
}: {
  accessToken: VssueAPI.AccessToken;
  commentId: string | number;
  reactionId: string | number;
}): Promise<boolean> => {
  const { status } = await request(
    `repos/${owner}/${repo}/issues/comments/${commentId}/reactions/${reactionId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.squirrel-girl-preview',
      },
    },
  );
  return status === 204;
};
