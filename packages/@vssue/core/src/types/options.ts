import type { CreateVssueAPIFunction, Query } from './api';

export interface VssueOptions {
  api: CreateVssueAPIFunction;
  owner: string;
  repo: string;
  clientId: string;
  clientSecret: string;
  baseURL: string;
  state: string;
  labels: Array<string>;
  prefix: string;
  admins: Array<string>;
  perPage: Query['perPage'];
  sort: Query['sort'];
  locale: string;
  proxy: string | ((url: string) => string);
  issueContent: (param: {
    options: VssueOptions;
    url: string;
  }) => string | Promise<string>;
  autoCreateIssue: boolean;
}
