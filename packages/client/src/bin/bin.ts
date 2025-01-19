import { dirname, resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';

import { program } from 'commander';

const schemaCommand = program.command('schema');
const buildSchemaCommand = schemaCommand.command('generate');
buildSchemaCommand.argument('<input>', 'base URL of server');
buildSchemaCommand.argument('<output>', 'output file');
buildSchemaCommand.action(async (input, output) => {
  const { buildTypes } = await import('./schemas/schemas.js');
  const location = resolve(output);
  const types = await buildTypes(input);
  const dir = dirname(location);
  await mkdir(dir, { recursive: true });
  await writeFile(location, types);
});

await program.parseAsync(process.argv);
