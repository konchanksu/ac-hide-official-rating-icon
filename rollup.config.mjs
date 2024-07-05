import typescript from '@rollup/plugin-typescript';

// rollup.config.mjs
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    sourcemap: true,
  },

  plugins: [
    typescript({
      compilerOptions: {
        lib: ['es6', 'dom'],
      },
      rootDir: 'src',
    }),
  ],
};
