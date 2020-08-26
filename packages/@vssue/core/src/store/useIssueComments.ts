import { ref, computed, watch } from 'vue';
import type { Ref } from 'vue';
import { getCleanURL } from '@vssue/utils';
import type { VssueStore, VssueAPI, VssueOptions } from '../types';

/**
 * Handle issue and comments
 */
export const useIssueComments = ({
  vssueOptions,
  vssueAPI,
  issueTitle,
  issueId,
  accessToken,
  handleAuth,
  login,
  isLogin,
  isAdmin,
}: {
  vssueOptions: VssueOptions;
  vssueAPI: VssueAPI.VssueAPI;
  issueTitle: string;
  issueId: string | number | null;
  accessToken: Ref<string | null>;
  handleAuth: () => Promise<void>;
} & Pick<VssueStore, 'login' | 'isAdmin' | 'isLogin'>): Pick<
  VssueStore,
  | 'query'
  | 'issue'
  | 'comments'
  | 'initComments'
  | 'postIssue'
  | 'getComments'
  | 'postComment'
  | 'deleteComment'
  | 'putComment'
  | 'getCommentReactions'
  | 'postCommentReaction'
  | 'isInitializing'
  | 'isFailed'
  | 'isIssueNotCreated'
  | 'isLoginRequired'
  | 'isCreatingIssue'
  | 'isLoadingComments'
  | 'isCreatingComment'
  | 'isUpdatingComment'
  | 'isPending'
> => {
  // query to get comments
  const query: VssueStore['query'] = ref({
    page: 1,
    perPage: vssueOptions.perPage,
    sort: vssueOptions.sort,
  });

  // issue info
  const issue: VssueStore['issue'] = ref(null);

  // comments to display
  const comments: VssueStore['comments'] = ref(null);

  // flags
  const isInitializing = ref(true);
  const isFailed = ref(false);
  const isIssueNotCreated = ref(false);
  const isLoginRequired = ref(false);
  const isCreatingIssue = ref(false);
  const isLoadingComments = ref(false);
  const isCreatingComment = ref(false);
  const isUpdatingComment = ref(false);
  const isPending = computed(
    () =>
      isLoadingComments.value ||
      isCreatingComment.value ||
      isUpdatingComment.value,
  );

  /**
   * Get comments of this vssue according to the issue id
   */
  const getComments: VssueStore['getComments'] = async () => {
    if (isLoadingComments.value || issue.value === null) return;

    try {
      isLoadingComments.value = true;

      comments.value = await vssueAPI.getComments({
        accessToken: accessToken.value,
        issueId: issue.value.id,
        query: query.value,
      });

      if (query.value.page !== comments.value.page) {
        query.value.page = comments.value.page;
      }

      if (query.value.perPage !== comments.value.perPage) {
        query.value.perPage = comments.value.perPage;
      }
    } catch (e) {
      if (
        e.response &&
        [401, 403].includes(e.response.status) &&
        !isLogin.value
      ) {
        isLoginRequired.value = true;
      } else {
        throw e;
      }
    } finally {
      isLoadingComments.value = false;
    }
  };

  /**
   * Post a new issue
   */
  const postIssue: VssueStore['postIssue'] = async () => {
    if (isCreatingIssue.value || issueId !== null || !issueTitle) return;

    // login to create issue
    if (!isLogin) {
      login();
    }

    // only owner/admins can create issue
    if (!isAdmin) return;

    try {
      isCreatingIssue.value = true;

      issue.value = await vssueAPI.postIssue({
        title: issueTitle,
        content: await vssueOptions.issueContent({
          options: vssueOptions,
          url: getCleanURL(window?.location.href ?? ''),
        }),
        accessToken: accessToken.value,
      });

      isIssueNotCreated.value = false;

      await getComments();
    } catch (e) {
      isFailed.value = true;
    } finally {
      isCreatingIssue.value = false;
    }
  };

  /**
   * Init comments
   */
  const initComments: VssueStore['initComments'] = async () => {
    try {
      await handleAuth();
    } catch (err) {
      // TODO
      console.log(err);
    } finally {
      isInitializing.value = false;
    }

    if (issueId) {
      // if issueId is set, get the issue and comments in the mean time
      // notice that vssue will not try to create the issue if the issue is not found
      [issue.value, comments.value] = await Promise.all([
        vssueAPI.getIssue({
          accessToken: accessToken.value,
          issueId,
        }),
        vssueAPI.getComments({
          accessToken: accessToken.value,
          issueId,
          query: query.value,
        }),
      ]);
    } else {
      // get issue according to title
      issue.value = await vssueAPI.getIssue({
        accessToken: accessToken.value,
        issueTitle,
      });

      if (issue.value === null) {
        // if the issue of this page does not exist
        isIssueNotCreated.value = true;

        // try to create issue when `autoCreateIssue = true`
        if (vssueOptions.autoCreateIssue) {
          await postIssue();
        }
      } else {
        // try to load comments
        await getComments();
      }
    }
  };

  /**
   * Post a new comment
   */
  const postComment = async ({
    content,
  }: {
    content: string;
  }): Promise<VssueAPI.Comment | void> => {
    if (isCreatingComment.value || issue.value === null) return;

    try {
      isCreatingComment.value = true;

      const comment = await vssueAPI.postComment({
        accessToken: accessToken.value,
        content,
        issueId: issue.value.id,
      });

      return comment;
    } finally {
      isCreatingComment.value = false;
    }
  };

  /**
   * Edit a comment
   */
  const putComment = async ({
    commentId,
    content,
  }: {
    commentId: number | string;
    content: string;
  }): Promise<VssueAPI.Comment | void> => {
    if (isUpdatingComment.value || issue.value === null) return;

    try {
      isUpdatingComment.value = true;

      const comment = await vssueAPI.putComment({
        accessToken: accessToken.value,
        issueId: issue.value.id,
        commentId,
        content,
      });

      return comment;
    } finally {
      isUpdatingComment.value = false;
    }
  };

  /**
   * Delete a comment
   */
  const deleteComment = async ({
    commentId,
  }: {
    commentId: number | string;
  }): Promise<boolean | void> => {
    if (isUpdatingComment.value || issue.value === null) return;

    try {
      isUpdatingComment.value = true;

      const success = await vssueAPI.deleteComment({
        accessToken: accessToken.value,
        issueId: issue.value.id,
        commentId,
      });

      return success;
    } finally {
      isUpdatingComment.value = false;
    }
  };

  /**
   * Get reactions of a comment
   */
  const getCommentReactions = async ({
    commentId,
  }: {
    commentId: string | number;
  }): Promise<VssueAPI.Reactions | void> => {
    if (issue.value === null) return;

    const reactions = await vssueAPI.getCommentReactions({
      accessToken: accessToken.value,
      issueId: issue.value.id,
      commentId,
    });

    return reactions;
  };

  /**
   * Create a new reaction to a certain comment
   */
  const postCommentReaction = async ({
    commentId,
    reaction,
  }: {
    commentId: string | number;
    reaction: keyof VssueAPI.Reactions;
  }): Promise<boolean | void> => {
    if (issue.value === null) return;

    const success = await vssueAPI.postCommentReaction({
      accessToken: accessToken.value,
      issueId: issue.value.id,
      commentId,
      reaction,
    });

    return success;
  };

  // watch perPage
  watch(
    () => query.value.perPage,
    () => {
      query.value.page = 1;
      getComments();
    },
  );

  // watch page & sort
  watch([() => query.value.page, () => query.value.sort], () => {
    getComments();
  });

  return {
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
