import path from 'node:path';
import fs from 'node:fs';

import fse from 'fs-extra';
import { createFilter, FilterPattern } from '@rollup/pluginutils';

// just createFilter Options
type Options = {
  include: FilterPattern,
  exclude: FilterPattern,
  options?: { resolve?: string | false | null }
}

export async function traversalFileTree(entry: string, list: Set<string> = new Set(), opts: Options) {
  const files = fs.readdirSync(entry);
  const filter = createFilter(opts?.include, opts.exclude, opts.options)
  for (let item of files) {
    const filePath = path.join(entry, item);
    const state = await fse.stat(filePath);
    if (state.isDirectory()) {
      await traversalFileTree(filePath, list, opts);
    } else {
      if (filter(filePath)) {
        list.add(filePath);
      }
    }
  }
}
