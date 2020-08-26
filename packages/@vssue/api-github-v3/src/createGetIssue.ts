import type { VssueAPI } from '@vssue/core';
import { buildURL } from '@vssue/utils';
import type { VssueRequest } from '@vssue/utils';
import type { ResponseIssue, ResponseSearch } from './types';
import { normalizeIssue } from './utils';

/**
 * Get issue of this page according to the issue id or the issue title
 *
 * @see https://developer.github.com/v3/issues/#list-issues-for-a-repository
 * @see https://developer.github.com/v3/issues/#get-a-single-issue
 * @see https://developer.github.com/v3/#pagination
 * @see https://developer.github.com/v3/search/#search-issues-and-pull-requests
 */
export const createGetIssue = ({
  repo,
  owner,
  labels,
  request,
}: {
  repo: string;
  owner: string;
  labels: string[];
  request: VssueRequest;
}): VssueAPI.VssueAPI['getIssue'] => async ({
  accessToken,
  issueId,
  issueTitle,
}: {
  accessToken: VssueAPI.AccessToken;
  issueId?: string | number;
  issueTitle?: string;
}) => {
  const headers: string[][] = [];

  if (accessToken) {
    headers.push(['Authorization', `token ${accessToken}`]);
  }

  if (issueId) {
    try {
      const { data } = await request<ResponseIssue>(
        buildURL(`repos/${owner}/${repo}/issues/${issueId}`, {
          // to avoid caching
          timestamp: Date.now(),
        }),
        {
          headers,
        },
      );
      return normalizeIssue(data);
    } catch (res) {
      if (res.status === 404) {
        return null;
      }
      throw res;
    }
  } else {
    const { data } = await request<ResponseSearch<ResponseIssue>>(
      buildURL(`search/issues`, {
        q: [
          `"${issueTitle}"`,
          `is:issue`,
          `in:title`,
          `repo:${owner}/${repo}`,
          `is:public`,
          ...labels.map((label) => `label:${label}`),
        ].join(' '),
        // to avoid caching
        timestamp: Date.now(),
      }),
      {
        headers,
      },
    );
    const issue = data.items
      .map(normalizeIssue)
      .find((item) => item.title === issueTitle);
    return issue || null;
  }
};
