import { VssueAPI } from '@vssue/core';

/**
 * The platform api info
 */
export const createPlatform = ({
  link,
}: {
  link: string;
}): VssueAPI.Platform => ({
  name: 'GitHub',
  link,
  version: 'v3',
  meta: {
    reactable: true,
    sortable: false,
  },
});
