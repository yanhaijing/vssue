import { VssueAPI } from '@vssue/core';
import { concatURL, createRequest, createRequestError } from '@vssue/utils';
import { createDeleteComment } from './createDeleteComment';
import { createDeleteCommentReaction } from './createDeleteCommentReaction';
import { createGetAccessToken } from './createGetAccessToken';
import { createGetCommentReactions } from './createGetCommentReactions';
import { createGetComments } from './createGetComments';
import { createGetIssue } from './createGetIssue';
import { createGetUser } from './createGetUser';
import { createHandleAuth } from './createHandleAuth';
import { createPlatform } from './createPlatform';
import { createPostComment } from './createPostComment';
import { createPostCommentReaction } from './createPostCommentReaction';
import { createPostIssue } from './createPostIssue';
import { createPutComment } from './createPutComment';
import { createRedirectAuth } from './createRedirectAuth';

/**
 * Github REST API v3
 *
 * @see https://developer.github.com/v3/
 * @see https://developer.github.com/apps/building-oauth-apps/
 */
export const createAPI: VssueAPI.CreateVssueAPIFunction = ({
  baseURL = 'https://github.com',
  owner,
  repo,
  labels,
  clientId,
  clientSecret = '',
  state,
  proxy = '',
}: VssueAPI.Options) => {
  const request = createRequest({
    baseURL:
      baseURL === 'https://github.com'
        ? // official github api endpoint
          'https://api.github.com'
        : // github enterprise server api endpoint
          concatURL(baseURL, 'api/v3'),
    preHandler: async (res) => {
      const data = res.data as Record<string, string>;

      // handle github common error message
      if (data?.error) {
        throw createRequestError(res, new Error(data?.error_description));
      }

      // handle github api rate limited error
      if (
        res.status === 403 &&
        data?.message.startsWith('API rate limit exceeded')
      ) {
        throw createRequestError(res, new Error(data?.message));
      }

      if (!res.ok) {
        throw createRequestError(res);
      }

      return res;
    },
  });

  const platform = createPlatform({ link: baseURL });

  const redirectAuth = createRedirectAuth({
    baseURL,
    clientId,
    state,
  });

  const getAccessToken = createGetAccessToken({
    baseURL,
    clientId,
    clientSecret,
    request,
    proxy,
  });

  const handleAuth = createHandleAuth({
    state,
    getAccessToken,
  });

  const getUser = createGetUser({
    request,
  });

  const getIssue = createGetIssue({
    repo,
    owner,
    labels,
    request,
  });

  const postIssue = createPostIssue({
    repo,
    owner,
    labels,
    request,
  });

  const getComments = createGetComments({
    repo,
    owner,
    labels,
    request,
  });

  const postComment = createPostComment({
    repo,
    owner,
    request,
  });

  const putComment = createPutComment({
    repo,
    owner,
    request,
  });

  const deleteComment = createDeleteComment({
    repo,
    owner,
    request,
  });

  const getCommentReactions = createGetCommentReactions({
    repo,
    owner,
    request,
  });

  const deleteCommentReaction = createDeleteCommentReaction({
    repo,
    owner,
    request,
  });

  const postCommentReaction = createPostCommentReaction({
    repo,
    owner,
    request,
    deleteCommentReaction,
  });

  return {
    platform,
    redirectAuth,
    handleAuth,
    getUser,
    getIssue,
    postIssue,
    getComments,
    postComment,
    putComment,
    deleteComment,
    getCommentReactions,
    postCommentReaction,
  };
};
