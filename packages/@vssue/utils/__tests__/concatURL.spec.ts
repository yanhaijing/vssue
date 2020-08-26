import { concatURL } from '@vssue/utils';

test('concatURL', () => {
  expect(concatURL('https://vssue.js.org/foo/', '/bar/baz/')).toBe(
    'https://vssue.js.org/foo/bar/baz/',
  );
});
