import type { VssueAPI } from '@vssue/core';
import { buildURL } from '@vssue/utils';
import type { VssueRequest } from '@vssue/utils';
import type { ResponseIssue, ResponseComment } from './types';
import { normalizeComment } from './utils';

/**
 * Get comments of this page according to the issue id
 *
 * @see https://developer.github.com/v3/issues/comments/#list-comments-on-an-issue
 * @see https://developer.github.com/v3/#pagination
 *
 * @remarks
 * Github V3 does not support sort for issue comments now.
 * Github V3 have to request the parent issue to get the count of comments.
 */
export const createGetComments = ({
  repo,
  owner,
  request,
}: {
  repo: string;
  owner: string;
  labels: string[];
  request: VssueRequest;
}): VssueAPI.VssueAPI['getComments'] => async ({
  accessToken,
  issueId,
  query: { page = 1, perPage = 10 /* , sort = 'desc' */ } = {},
}: {
  accessToken: VssueAPI.AccessToken;
  issueId: string | number;
  query?: Partial<VssueAPI.Query>;
}) => {
  const issueHeaders: string[][] = [];
  const commentsHeaders: string[][] = [];

  commentsHeaders.push(
    ['Accept', 'application/vnd.github.v3.raw+json'],
    ['Accept', 'application/vnd.github.v3.html+json'],
    ['Accept', 'application/vnd.github.squirrel-girl-preview'],
  );

  if (accessToken) {
    issueHeaders.push(['Authorization', `token ${accessToken}`]);
    commentsHeaders.push(['Authorization', `token ${accessToken}`]);
  }

  // github v3 have to get the total count of comments by requesting the issue
  const [issueRes, commentsRes] = await Promise.all([
    request<ResponseIssue>(
      buildURL(`repos/${owner}/${repo}/issues/${issueId}`, {
        // to avoid caching
        timestamp: Date.now(),
      }),
      {
        headers: issueHeaders,
      },
    ),
    request<ResponseComment[]>(
      buildURL(`repos/${owner}/${repo}/issues/${issueId}/comments`, {
        // pagination
        page,
        per_page: perPage,
        /**
         * github v3 api does not support sort for issue comments
         * have sent feedback to github support
         */
        // 'sort': 'created',
        // 'direction': sort,
        // to avoid caching
        timestamp: Date.now(),
      }),
      {
        headers: commentsHeaders,
      },
    ),
  ]);

  // it's annoying that have to get the page and per_page from the `Link` header
  const linkHeader = commentsRes.headers.get('link') || '';

  // resolve current page
  let thisPage = 1;

  /* istanbul ignore next */
  if (/rel="next"/.test(linkHeader)) {
    thisPage =
      Number(linkHeader.replace(/^.*[^_]page=(\d*).*rel="next".*$/, '$1')) - 1;
  } else if (/rel="prev"/.test(linkHeader)) {
    thisPage =
      Number(linkHeader.replace(/^.*[^_]page=(\d*).*rel="prev".*$/, '$1')) + 1;
  }

  /* istanbul ignore next */
  const thisPerPage = linkHeader
    ? Number(linkHeader.replace(/^.*per_page=(\d*).*$/, '$1'))
    : perPage;

  return {
    count: Number(issueRes.data.comments),
    page: thisPage,
    perPage: thisPerPage,
    data: commentsRes.data.map(normalizeComment),
  };
};
