import { readFile } from "fs/promises";
import { setupServer } from "./exports.js";
import { resolve } from "path";

const pkgLocation = resolve('./package.json');
const pkg = JSON.parse(await readFile(pkgLocation, 'utf-8'));

const backendLocation = resolve(pkg.backend?.location || './dist/backend/main.js');
const { config } = await import(backendLocation);

await setupServer(config);
