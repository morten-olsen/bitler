import { DatabaseOptions } from "@bitler/core";
import { init } from "./migrations/migrations.001-init.js";

const dbConfig: DatabaseOptions = {
  name: 'timers',
  migrations: [init],
};

export { dbConfig };

