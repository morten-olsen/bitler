import { existsSync } from 'fs';
import { resolve } from 'path';
import { randomBytes } from 'crypto';
import { readFile, writeFile } from 'fs/promises';

import jwt from 'jsonwebtoken';
import { z, ZodSchema } from '@bitlerjs/core';

class AuthService {
  #setupPromise?: Promise<{ key: string }>;

  #generateJWTSecret = async (keyLocation: string) => {
    const secret = randomBytes(256).toString('base64');
    await writeFile(keyLocation, secret);
  };

  #setup = async () => {
    const dataDir = process.env.DATA_DIR || './data';
    const keyLocation = resolve(dataDir, 'key.pem');
    if (!existsSync(keyLocation)) {
      await this.#generateJWTSecret(keyLocation);
    }
    const key = await readFile(keyLocation, 'utf-8');
    return {
      key,
    };
  };

  #getData = async () => {
    if (!this.#setupPromise) {
      this.#setupPromise = this.#setup();
    }
    return this.#setupPromise;
  };

  public generateToken = async (payload: object) => {
    const { key } = await this.#getData();
    return jwt.sign(payload, key);
  };

  public verifyToken = async <TSchema extends ZodSchema>(token: string, schema: TSchema): Promise<z.infer<TSchema>> => {
    const { key } = await this.#getData();
    const content = jwt.verify(token, key);
    return schema.parse(content);
  };
}

export { AuthService };
