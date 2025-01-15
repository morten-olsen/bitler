import { DatabaseOptions } from '@bitlerjs/core';

import { migrations } from './migrations/migrations.js';

const databaseConfig: DatabaseOptions = {
  name: 'homeassistant.rooms',
  migrations,
};

export { databaseConfig };
