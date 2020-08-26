import type { VssueAPI } from '@vssue/core';
import type { VssueRequest } from '@vssue/utils';
import type { ResponseComment } from './types';
import { normalizeComment } from './utils';

/**
 * Create a new comment
 *
 * @see https://developer.github.com/v3/issues/comments/#create-a-comment
 */
export const createPostComment = ({
  repo,
  owner,
  request,
}: {
  repo: string;
  owner: string;
  request: VssueRequest;
}): VssueAPI.VssueAPI['postComment'] => async ({
  accessToken,
  issueId,
  content,
}: {
  accessToken: VssueAPI.AccessToken;
  issueId: string | number;
  content: string;
}): Promise<VssueAPI.Comment> => {
  const { data } = await request<ResponseComment>(
    `repos/${owner}/${repo}/issues/${issueId}/comments`,
    {
      method: 'POST',
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
