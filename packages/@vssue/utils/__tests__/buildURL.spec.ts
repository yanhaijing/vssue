import { buildURL } from '@vssue/utils';

test('buildURL', () => {
  expect(
    buildURL('https://vssue.js.org', {
      foo: 'foobar',
      bar: 'barfoo',
    }),
  ).toBe('https://vssue.js.org?foo=foobar&bar=barfoo');
});
