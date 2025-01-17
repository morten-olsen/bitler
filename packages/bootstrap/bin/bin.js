#!/usr/bin/env node
import { execa } from 'execa';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const tsxLocation = fileURLToPath(import.meta.resolve('tsx/package.json'));
const tsxScriptLocation = resolve(tsxLocation, '../dist/cli.mjs');
const bootstrapScriptLocation = resolve(import.meta.dirname, '../dist/bootstrap.js');

const tsxArgs = [];

if (process.argv.includes('--watch')) {
  tsxArgs.push('--watch');
}

await execa('node', [tsxScriptLocation, ...tsxArgs, bootstrapScriptLocation], {
  stdio: 'inherit',
});
