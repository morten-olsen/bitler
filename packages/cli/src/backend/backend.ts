import { execa } from 'execa';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { buildTypescript } from './backend.typescript.js';

const createBackendDev = async () => {
  const tsxLocation = fileURLToPath(import.meta.resolve('tsx/package.json'));
  const bin = resolve(tsxLocation, '..', 'dist', 'cli.mjs');
  const bootstrapLocation = fileURLToPath(import.meta.resolve('@bitler/core/bootstrap'));
  const start = () => {
    const server = execa('node', [bin, '--watch', bootstrapLocation], {
      stdio: 'inherit',
    });

    return server;
  }

  return {
    start,
  };
}

const buildBackend = async () => {
  await buildTypescript({
    compilerOptions: {
      outDir: './dist/backend',
      baseUrl: './backend',
    }
  });
};

export { createBackendDev, buildBackend };
