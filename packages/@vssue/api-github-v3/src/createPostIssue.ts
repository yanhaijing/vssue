import type { VssueAPI } from '@vssue/core';
import type { VssueRequest } from '@vssue/utils';
import type { ResponseIssue } from './types';
import { normalizeIssue } from './utils';

/**
 * Create a new issue
 *
 * @see https://developer.github.com/v3/issues/#create-an-issue
 */
export const createPostIssue = ({
  repo,
  owner,
  labels,
  request,
}: {
  repo: string;
  owner: string;
  labels: string[];
  request: VssueRequest;
}): VssueAPI.VssueAPI['postIssue'] => async ({
  accessToken,
  title,
  content,
}: {
  accessToken: VssueAPI.AccessToken;
  title: string;
  content: string;
}): Promise<VssueAPI.Issue> => {
  const { data } = await request<ResponseIssue>(
    `repos/${owner}/${repo}/issues`,
    {
      method: 'POST',
      body: JSON.stringify({
        title,
        body: content,
        labels,
      }),
      headers: { Authorization: `token ${accessToken}` },
    },
  );
  return normalizeIssue(data);
};
