import type { VssueAPI } from '@vssue/core';
import type { VssueRequest } from '@vssue/utils';
import type { createDeleteCommentReaction } from './createDeleteCommentReaction';
import type { ResponseReaction } from './types';
import { mapReactionName } from './utils';

/**
 * Create a new reaction of a comment
 *
 * @see https://developer.github.com/v3/reactions/#create-reaction-for-an-issue-comment
 */
export const createPostCommentReaction = ({
  repo,
  owner,
  request,
  deleteCommentReaction,
}: {
  repo: string;
  owner: string;
  request: VssueRequest;
  deleteCommentReaction: ReturnType<typeof createDeleteCommentReaction>;
}): VssueAPI.VssueAPI['postCommentReaction'] => async ({
  accessToken,
  commentId,
  reaction,
}: {
  accessToken: VssueAPI.AccessToken;
  issueId: string | number;
  commentId: string | number;
  reaction: keyof VssueAPI.Reactions;
}): Promise<boolean> => {
  const { status, data } = await request<ResponseReaction>(
    `repos/${owner}/${repo}/issues/comments/${commentId}/reactions`,
    {
      method: 'POST',
      body: JSON.stringify({
        content: mapReactionName(reaction),
      }),
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.squirrel-girl-preview',
      },
    },
  );

  // 200 OK if the reaction is already token
  if (status === 200) {
    return deleteCommentReaction({
      accessToken,
      commentId,
      reactionId: data.id,
    });
  }

  // 201 CREATED
  return status === 201;
};
