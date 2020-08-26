import type { VssueAPI } from '@vssue/core';
import type {
  ResponseUser,
  ResponseIssue,
  ResponseComment,
  ResponseReactionsSummary,
} from './types';

export const normalizeUser = (user: ResponseUser): VssueAPI.User => ({
  username: user.login,
  avatar: user.avatar_url,
  homepage: user.html_url,
});

export const normalizeIssue = (issue: ResponseIssue): VssueAPI.Issue => ({
  id: issue.number,
  title: issue.title,
  content: issue.body,
  link: issue.html_url,
});

export const normalizeReactions = (
  reactions: ResponseReactionsSummary,
): VssueAPI.Reactions => ({
  like: reactions['+1'],
  unlike: reactions['-1'],
  heart: reactions.heart,
});

export const normalizeComment = (
  comment: ResponseComment,
): VssueAPI.Comment => ({
  id: comment.id,
  content: comment.body_html,
  contentRaw: comment.body,
  author: normalizeUser(comment.user),
  createdAt: comment.created_at,
  updatedAt: comment.updated_at,
  reactions: normalizeReactions(comment.reactions),
});

export const mapReactionName = (reaction: keyof VssueAPI.Reactions): string => {
  if (reaction === 'like') return '+1';
  if (reaction === 'unlike') return '-1';
  return reaction;
};
