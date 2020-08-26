import type { VssueAPI } from '@vssue/core';
import type { VssueRequest } from '@vssue/utils';
import type { ResponseComment } from './types';
import { normalizeComment } from './utils';

/**
 * Edit a comment
 *
 * @see https://developer.github.com/v3/issues/comments/#edit-a-comment
 */
export const createPutComment = ({
  repo,
  owner,
  request,
}: {
  repo: string;
  owner: string;
  request: VssueRequest;
}): VssueAPI.VssueAPI['putComment'] => async ({
  accessToken,
  commentId,
  content,
}: {
  accessToken: VssueAPI.AccessToken;
  issueId: string | number;
  commentId: string | number;
  content: string;
}): Promise<VssueAPI.Comment> => {
  const { data } = await request<ResponseComment>(
    `repos/${owner}/${repo}/issues/comments/${commentId}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        body: content,
      }),
      headers: [
        ['Authorization', `token ${accessToken}`],
        ['Content-Type', 'application/json'],
        ['Accept', 'application/vnd.github.v3.raw+json'],
        ['Accept', 'application/vnd.github.v3.html+json'],
        ['Accept', 'application/vnd.github.squirrel-girl-preview'],
      ],
    },
  );
  return normalizeComment(data);
};
