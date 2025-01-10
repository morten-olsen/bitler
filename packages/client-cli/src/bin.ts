import { program } from "commander";
import { buildTypes } from "./schemas/schemas.js";
import { dirname, resolve } from "path";
import { mkdir, writeFile } from "fs/promises";

const buildCommand = program.command('build')
buildCommand.argument('<input>', 'base URL of server')
buildCommand.argument('<output>', 'output file')
buildCommand.action(async (input, output) => {
  const location = resolve(output);
  const types = await buildTypes(input);
  const dir = dirname(location);
  await mkdir(dir, { recursive: true });
  await writeFile(location, types);
});

await program.parseAsync(process.argv);
