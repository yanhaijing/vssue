module.exports = {
  root: true,

  extends: ['@meteorlxy/prettier'],

  overrides: [
    // typescript configs
    {
      files: ['*.ts', '*.vue'],

      excludedFiles: ['packages/docs/**/*.vue'],

      extends: ['@meteorlxy/prettier-typescript-vue'],

      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        'consistent-return': 'off',
      },
    },

    // jest configs
    {
      files: ['*.spec.ts'],

      env: {
        jest: true,
      },

      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },

    // playground and config files
    {
      files: ['playground/**/*', '.*.js'],

      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
