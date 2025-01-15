import { createHash } from 'crypto';
import { join, resolve } from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';

import { Container } from '../container/container.js';
import { Databases } from '../databases/databases.js';
import { createId } from '../utils/ids.js';

import { dbConfig } from './files.db.js';

type AddFileOptions = {
  owner?: string;
  expiresAt?: Date;
  contentType: string;
  content: string | Buffer;
};

class Files {
  #container: Container;

  constructor(container: Container) {
    this.#container = container;
  }

  public add = async (options: AddFileOptions) => {
    const contentHash = createHash('sha256').update(options.content).digest('hex');
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(dbConfig);
    const id = createId();

    const dataLocation = resolve(process.env.DATA_DIR || './data');
    const first = contentHash.slice(0, 2);
    const location = join(dataLocation, 'files', first, contentHash);
    await mkdir(location, { recursive: true });

    await writeFile(location, options.content);

    await db('files').insert({
      hash: contentHash,
      createdAt: new Date(),
      contentType: options.contentType,
    });

    await db('leases').insert({
      id,
      hash: contentHash,
      expiresAt: options.expiresAt,
      owner: options.owner,
    });

    return {
      contentHash,
      leaseId: id,
    };
  };

  public get = async (hash: string) => {
    const dbs = this.#container.get(Databases);
    const db = await dbs.get(dbConfig);
    const info = await db('files').where('hash', hash).first();
    if (!info) {
      throw new Error('File not found');
    }
    const dataLocation = resolve(process.env.DATA_DIR || './data');
    const first = info.hash.slice(0, 2);
    const location = join(dataLocation, 'files', first, info.hash);
    const content = await readFile(location);

    return {
      hash: info.hash,
      contentType: info.contentType,
      content,
    };
  };
}

export { Files };
