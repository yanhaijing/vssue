import { parseQuery } from '@vssue/utils';

test('parseQuery', () => {
  expect(parseQuery('?foo=foobar&bar=barfoo')).toMatchObject({
    foo: 'foobar',
    bar: 'barfoo',
  });
});
