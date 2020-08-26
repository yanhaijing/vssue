import type { VssueAPI } from '@vssue/core';
import { buildURL } from '@vssue/utils';
import type { VssueRequest } from '@vssue/utils';
import type { ResponseComment } from './types';
import { normalizeReactions } from './utils';

/**
 * Get reactions of a comment
 *
 * @see https://developer.github.com/v3/issues/comments/#get-a-single-comment
 * @see https://developer.github.com/v3/reactions/#list-reactions-for-an-issue-comment
 *
 * @remarks
 * The `List reactions for an issue comment` API also returns author of each reaction.
 * As we only need the count, use the `Get a single comment` API is much simpler.
 */
export const createGetCommentReactions = ({
  repo,
  owner,
  request,
}: {
  repo: string;
  owner: string;
  request: VssueRequest;
}): VssueAPI.VssueAPI['getCommentReactions'] => async ({
  accessToken,
  commentId,
}: {
  accessToken: VssueAPI.AccessToken;
  issueId: string | number;
  commentId: string | number;
}): Promise<VssueAPI.Reactions> => {
  const { data } = await request<ResponseComment>(
    buildURL(`repos/${owner}/${repo}/issues/comments/${commentId}`, {
      // to avoid caching
      timestamp: Date.now(),
    }),
    {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.squirrel-girl-preview',
      },
    },
  );
  return normalizeReactions(data.reactions);
};
