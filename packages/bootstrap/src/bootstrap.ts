import { setupServer } from "@bitler/core";
import { readFile } from "fs/promises";
import { resolve } from "path";


const pkgLocation = resolve('./package.json');
const pkg = JSON.parse(await readFile(pkgLocation, 'utf-8'));

const backendLocation = resolve(pkg.backend?.location || './backend/main.ts');
const { config } = await import(backendLocation);

await setupServer(config);
