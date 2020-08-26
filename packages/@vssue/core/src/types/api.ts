export interface Platform {
  name: string;
  link: string;
  version: string;
  meta: {
    reactable: boolean;
    sortable: boolean;
  };
}

export type AccessToken = string | null;

export interface User {
  username: string;
  avatar?: string;
  homepage?: string;
}

export interface Issue {
  id: string | number;
  title: string;
  content: string;
  link: string;
}

export interface Comment {
  id: string | number;
  content: string;
  contentRaw: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  reactions?: Reactions | null;
}

export interface Comments {
  count: number;
  page: number;
  perPage: number;
  data: Array<Comment>;
}

export interface Reactions {
  like?: number;
  unlike?: number;
  heart?: number;
}

export interface Query {
  page: number;
  perPage: number;
  sort: 'asc' | 'desc';
}

export interface VssueAPI {
  /**
   * The platform api info
   */
  readonly platform: Platform;

  /**
   * Redirect to the authorization page of platform.
   */
  redirectAuth(): void;

  /**
   * Handle authorization.
   *
   * @remarks
   * If the `code` and `state` exist in the query, and the `state` matches, remove them from query, and try to get the access token.
   */
  handleAuth(): Promise<AccessToken>;

  /**
   * Get the logined user with access token.
   */
  getUser(options: { accessToken: AccessToken }): Promise<User>;

  /**
   * Get issue according to id or title
   */
  getIssue(options: {
    accessToken: AccessToken;
    issueId?: string | number;
    issueTitle?: string;
  }): Promise<Issue | null>;

  /**
   * Create a new issue
   */
  postIssue(options: {
    accessToken: AccessToken;
    title: string;
    content: string;
  }): Promise<Issue>;

  /**
   * Get comments of issue according to the issue id
   */
  getComments(options: {
    accessToken: AccessToken;
    issueId: string | number;
    query?: Partial<Query>;
  }): Promise<Comments>;

  /**
   * Create a new comment
   */
  postComment(options: {
    accessToken: AccessToken;
    issueId: string | number;
    content: string;
  }): Promise<Comment>;

  /**
   * Edit a comment
   */
  putComment(options: {
    accessToken: AccessToken;
    issueId: string | number;
    commentId: string | number;
    content: string;
  }): Promise<Comment>;

  /**
   * Delete a comment
   */
  deleteComment(options: {
    accessToken: AccessToken;
    issueId: string | number;
    commentId: string | number;
  }): Promise<boolean>;

  /**
   * Get reaction of a comment
   */
  getCommentReactions(options: {
    accessToken: AccessToken;
    issueId: string | number;
    commentId: string | number;
  }): Promise<Reactions>;

  /**
   * Create a new reaction of a comment
   */
  postCommentReaction(options: {
    accessToken: AccessToken;
    issueId: string | number;
    commentId: string | number;
    reaction: keyof Reactions;
  }): Promise<boolean>;
}

export type Options = {
  owner: string;
  repo: string;
  clientId: string;
  clientSecret?: string;
  baseURL?: string;
  state: string;
  labels: Array<string>;
  proxy?: string | ((url: string) => string);
};

export type CreateVssueAPIFunction = (options: Options) => VssueAPI;
