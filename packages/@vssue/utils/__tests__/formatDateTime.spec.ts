import { formatDateTime } from '@vssue/utils';

test('formatDateTime', () => {
  expect(formatDateTime('2018-06-23T18:51:17Z')).toMatch(
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  );
});
