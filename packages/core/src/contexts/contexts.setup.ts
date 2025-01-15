import { Container } from '../container/container.js';
import { Session } from '../session/session.js';

import { Context } from './contexts.context.js';

type ContextSetupOptions = {
  container: Container;
  context: Context;
  session: Session;
};

type ContextSetup = {
  handler: (options: ContextSetupOptions) => Promise<void>;
};

const createContextSetup = (setup: ContextSetup): ContextSetup => setup;

export { createContextSetup, type ContextSetupOptions, type ContextSetup };
