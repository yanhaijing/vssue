import { resolve } from 'path';
import type { UserConfig } from 'vite';

const internalDependencies = [
  '@vssue/core',
  '@vssue/api-bitbucket-v2',
  '@vssue/api-github-v3',
  '@vssue/api-github-v4',
  '@vssue/api-gitlab-v4',
  '@vssue/theme-default',
  '@vssue/utils',
];

const config: UserConfig = {
  root: resolve(__dirname, 'playground'),
  port: 8080,
  define: {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    __VERSION__: require('./package.json').version,
  },
  alias: {
    vue: '/@modules/vue/dist/vue.runtime.esm-bundler.js',
    ...Object.fromEntries(
      internalDependencies.map((dep) => [dep, `/@modules/${dep}/src`]),
    ),
  },
  optimizeDeps: {
    exclude: internalDependencies,
  },
};

export default config;
