import type { Ref, ComputedRef } from 'vue';
import type * as VssueAPI from './api';
import type { VssueOptions } from './options';

export interface VssueStore {
  /**
   * Version and options
   */
  issueTitle: string;
  issueId: string | number | null;
  vssueOptions: VssueOptions;
  vssueAPI: VssueAPI.VssueAPI;

  /**
   * Auth
   */
  user: Ref<VssueAPI.User | null>;
  login: () => void;
  logout: () => void;
  isLogin: ComputedRef<boolean>;
  isAdmin: ComputedRef<boolean>;

  /**
   * Issue & Comments
   */
  query: Ref<VssueAPI.Query>;
  issue: Ref<VssueAPI.Issue | null>;
  comments: Ref<VssueAPI.Comments | null>;
  initComments: () => Promise<void>;
  postIssue: () => Promise<void>;
  getComments: () => Promise<void>;
  postComment: (options: {
    content: string;
  }) => Promise<VssueAPI.Comment | void>;
  deleteComment: (options: {
    commentId: number | string;
  }) => Promise<boolean | void>;
  putComment: (options: {
    commentId: number | string;
    content: string;
  }) => Promise<VssueAPI.Comment | void>;
  getCommentReactions: (options: {
    commentId: number | string;
  }) => Promise<VssueAPI.Reactions | void>;
  postCommentReaction: (options: {
    commentId: number | string;
    reaction: keyof VssueAPI.Reactions;
  }) => Promise<boolean | void>;
  isInitializing: Ref<boolean>;
  isFailed: Ref<boolean>;
  isIssueNotCreated: Ref<boolean>;
  isLoginRequired: Ref<boolean>;
  isCreatingIssue: Ref<boolean>;
  isLoadingComments: Ref<boolean>;
  isCreatingComment: Ref<boolean>;
  isUpdatingComment: Ref<boolean>;
  isPending: Ref<boolean>;
}
