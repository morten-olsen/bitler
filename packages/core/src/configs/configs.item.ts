import { ZodSchema, z } from 'zod';

import { Container } from '../container/container.js';

type ConfigItemValidateOptions<TSchema extends ZodSchema> = {
  input: z.infer<TSchema>;
  container: Container;
};

type ConfigItem<TSchema extends ZodSchema> = {
  kind: string;
  name: string;
  group?: string;
  description: string;
  schema: TSchema;
  validate?: (options: ConfigItemValidateOptions<TSchema>) => Promise<void>;
};

const createConfigItem = <TSchema extends ZodSchema>(config: ConfigItem<TSchema>) => config;

export { createConfigItem, type ConfigItem, type ConfigItemValidateOptions };
