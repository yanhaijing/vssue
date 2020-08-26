import { getCleanURL } from '@vssue/utils';

test('getCleanURL', () => {
  expect(
    getCleanURL('https://vssue.js.org/foo/bar/?foo=foobar&bar=barfoo'),
  ).toBe('https://vssue.js.org/foo/bar/');
  expect(getCleanURL('')).toBe('');
});
