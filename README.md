# vite-plugin-not-using

> detect the project files not using in the project. (allow output result to file)

## Features

- [x] detect the project truly using files with vite
- [x] allow report the result to file
- [x] allow ignore some files or just include some files

## Try it now

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Plugin from '../../src/index';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Plugin({
      root: process.cwd(),
      include: ['src/**/*'],
      exclude: ['node_modules/**', 'dist/**'],
    }),
  ],
});
```

## LICENSE

[MIT](./LICENSE) License © 2022 [zwkang](https://github.com/zwkang)
