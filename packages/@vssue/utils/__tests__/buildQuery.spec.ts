import { buildQuery } from '@vssue/utils';

test('buildQuery', () => {
  expect(
    buildQuery({
      foo: 'foobar',
      bar: 'barfoo',
    }),
  ).toBe('foo=foobar&bar=barfoo');
});
