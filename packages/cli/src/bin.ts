import { program } from "commander";
import { dirname, resolve } from "path";
import { mkdir, writeFile } from "fs/promises";

const schemaCommand = program.command('schema')
const buildSchemaCommand = schemaCommand.command('generate')
buildSchemaCommand.argument('<input>', 'base URL of server')
buildSchemaCommand.argument('<output>', 'output file')
buildSchemaCommand.action(async (input, output) => {
  const { buildTypes } = await import('./schemas/schemas.js');
  const location = resolve(output);
  const types = await buildTypes(input);
  const dir = dirname(location);
  await mkdir(dir, { recursive: true });
  await writeFile(location, types);
});

const frontendCommand = program.command('frontend')
const frontendBuildCommand = frontendCommand.command('build')
frontendBuildCommand.action(async () => {
  const { buildFrontend } = await import('./frontend/frontend.js');
  await buildFrontend();
});

const frontendDevCommand = frontendCommand.command('dev')
frontendDevCommand.action(async () => {
  const { createFrontendDev } = await import('./frontend/frontend.js');
  const server = await createFrontendDev();
  await server.listen(1337);
  server.printUrls();
  server.bindCLIShortcuts({ print: true })
});

await program.parseAsync(process.argv);
