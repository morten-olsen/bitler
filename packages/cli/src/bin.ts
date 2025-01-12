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

const devCommand = program.command('dev')
devCommand.action(async () => {
  const { createBackendDev } = await import('./backend/backend.js');
  const { createFrontendDev } = await import('./frontend/frontend.js');
  const frontend = await createFrontendDev();
  await frontend.listen(1337);
  const backend = await createBackendDev();
  backend.start();
});

const buildCommand = program.command('build')
buildCommand.action(async () => {
  const { buildBackend } = await import('./backend/backend.js');
  await buildBackend();
  const { buildFrontend } = await import('./frontend/frontend.js');
  await buildFrontend();
});


const backendCommand = program.command('backend')

const backendBuildCommand = backendCommand.command('build')
backendBuildCommand.action(async () => {
  const { buildBackend } = await import('./backend/backend.js');
  await buildBackend();
});

const backendDevCommand = backendCommand.command('dev')
backendDevCommand.action(async () => {
  const { createBackendDev } = await import('./backend/backend.js');
  const backend = await createBackendDev();
  backend.start();
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
