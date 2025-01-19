import { resolve } from 'path';

const frontendBundleRoot = resolve(import.meta.dirname, '../dist');

export { frontendBundleRoot };
