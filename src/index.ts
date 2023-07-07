import type { Plugin } from 'vite';

interface Options {
  [key: string]: any;
}

function VitePlugin(options: Options = {}): Plugin {
  return {
    name: `pkg-name`,
  };
}

export default VitePlugin;
