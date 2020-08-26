import type { VssueStore, VssueOptions } from '../types';
import { useAuth } from './useAuth';
import { useIssueComments } from './useIssueComments';

export const createStore = ({
  vssueOptions,
  issueTitle,
  issueId = null,
}: {
  vssueOptions: VssueOptions;
  issueTitle: string;
  issueId?: string | number | null;
}): VssueStore => {
  // create vssue API
  const vssueAPI = vssueOptions.api(vssueOptions);

  // handle authorization
  const {
    accessToken,
    handleAuth,
    user,
    login,
    logout,
    isLogin,
    isAdmin,
  } = useAuth({
    vssueOptions,
    vssueAPI,
  });

  const {
    query,
    issue,
    comments,
    initComments,
    postIssue,
    getComments,
    postComment,
    putComment,
    deleteComment,
    getCommentReactions,
    postCommentReaction,
    isInitializing,
    isFailed,
    isIssueNotCreated,
    isLoginRequired,
    isCreatingIssue,
    isLoadingComments,
    isCreatingComment,
    isUpdatingComment,
    isPending,
  } = useIssueComments({
    vssueOptions,
    vssueAPI,
    issueTitle,
    issueId,

    accessToken,
    handleAuth,
    login,
    isLogin,
    isAdmin,
  });

  return {
    issueTitle,
    issueId,
    vssueOptions,
    vssueAPI,

    user,
    login,
    logout,
    isLogin,
    isAdmin,

    query,
    issue,
    comments,
    initComments,
    postIssue,
    getComments,
    postComment,
    putComment,
    deleteComment,
    getCommentReactions,
    postCommentReaction,
    isInitializing,
    isFailed,
    isIssueNotCreated,
    isLoginRequired,
    isCreatingIssue,
    isLoadingComments,
    isCreatingComment,
    isUpdatingComment,
    isPending,
  };
};
