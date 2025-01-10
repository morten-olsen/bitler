import { DatabaseOptions } from "@bitler/core";
import { migrations } from "./migrations/migrations.js";

const databaseConfig: DatabaseOptions = {
  name: 'agents',
  migrations,
};

export { databaseConfig }
