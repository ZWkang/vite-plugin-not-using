import { createFilter, type Plugin } from 'vite';
import { FilterPattern } from '@rollup/pluginutils'

import colors from 'picocolors'
import { traversalFileTree } from './traversalFileTree';
import fse, { WriteFileOptions } from 'fs-extra'

interface Options {
  [key: string]: any;

  enforce?: Plugin['enforce'],
  include?: FilterPattern,
  exclude?: FilterPattern,
  options?: { resolve?: string | false | null },
  output?: WriteFileOptions & {
    file_name: string;
  },
  hideLogDetail?: boolean;
}

export const queryRE = /\?.*$/s
export const hashRE = /#.*$/s

export const cleanUrl = (url: string): string =>
  url.replace(hashRE, '').replace(queryRE, '')


const DEFAULT_INCLUDE = ['**/*'];
const DEFAULT_EXCLUDE = ['node_modules/**'];

const loadAssets = new Set<string>();
const workSpaceAssets = new Set<string>();

function printList(list: Set<string>, root: string) {
  console.log(
    colors.green(`[vite-plugin-not-using]:
${list.size} files are not used in the project, not using files as follows:`),
  )
  for (const item of list) {
    console.log(colors.green(
      item.replace(root, '.')
    ))
  }
}

async function getAFileSize(filePath: string) {

  const result = await fse.stat(filePath);
  return result.size;
}

function VitePlugin(opts: Options): Plugin {
  const {
    enforce = 'post',
    include = DEFAULT_INCLUDE,
    exclude = DEFAULT_EXCLUDE,
    options,
    root,
    output,
    hideLogDetail = false,
    calculateSizes = false,
  } = opts;
  return {
    name: `vite-plugin-not-using`,
    enforce,
    load(id) {
      const url = cleanUrl(id);
      const filter = createFilter(include, exclude, options);
      if (filter(url)) {
        loadAssets.add(url);
      }
    },
    async closeBundle() {
      await traversalFileTree(root, workSpaceAssets, { include, exclude, options });
      const diff = new Set([...workSpaceAssets].filter(x => !loadAssets.has(x)));
      if (hideLogDetail) {
        console.log(
          colors.green(`[vite-plugin-not-using]:
${diff.size} files are not used in the project`),
        )
      } else {
        printList(diff, root);
      }

      if (calculateSizes) {
        let failedCount = 0;
        const results = await Promise.all([...diff].map((async (item) => {
          return await getAFileSize(item).catch(() => failedCount++);
        })))
        const totalSize = results.reduce((pre, cur) => pre + cur, 0);
        console.log(
          colors.green(`[vite-plugin-not-using]:
total not using files: ${totalSize} bytes, ${totalSize / 1024} KB, ${diff.size} files, ${failedCount} failed count;
          `)
        )


      }
      loadAssets.clear();
      workSpaceAssets.clear();

      if (output) {
        await fse.writeFile(output.file_name, [...diff].join('\n'), output);
        console.log(colors.green(`[vite-plugin-not-using]`), `success output file: ${output.file_name}`)
      }
    }
  };
}

export default VitePlugin;
