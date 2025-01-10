import knex, { Knex } from "knex";
import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';
import ClientPgLite from 'knex-pglite';
import { join, resolve } from "path";
import { mkdir } from 'fs/promises';

type DatabaseMigration = {
  name: string;
  up: (knex: Knex) => Promise<void>;
  down: (knex: Knex) => Promise<void>;
}

type DatabaseOptions = {
  name: string;
  migrations: DatabaseMigration[];
}

const createDatabase = (options: DatabaseOptions) => options;
const createMigration = (options: DatabaseMigration) => options;

class Databases {
  #dbs: Map<string, Promise<Knex>> = new Map();

  #setup = async (options: DatabaseOptions) => {
    const dataLocation = resolve(process.env.DATA_DIR || './data');
    const location = join(dataLocation, 'databases', options.name);
    await mkdir(location, { recursive: true });

    const pglite =
      new PGlite({
        dataDir: location,
        extensions: {
          vector,
        },
      });

    const migrationSource: Knex.MigrationSource<DatabaseMigration> = {
      getMigrations: async () => options.migrations,
      getMigrationName: (migration) => migration.name,
      getMigration: async (migration) => migration,
    };

    const db = knex({
      client: ClientPgLite,
      dialect: 'postgres',
      connection: { pglite } as any,
    });

    await db.raw(`CREATE EXTENSION IF NOT EXISTS vector;`);
    await db.migrate.latest({
      migrationSource,
    });

    return db;
  }

  public list = () => {
    return Object.fromEntries(
      Array.from(this.#dbs.entries()).map(([name, db]) => [name, db])
    );
  }

  public destroy = async () => {
    await Promise.all(
      Array.from(this.#dbs.values()).map(async (db) => {
        const knex = await db;
        await knex.destroy();
      })
    );
  }

  public get = async (options: DatabaseOptions) => {
    if (!this.#dbs.has(options.name)) {
      this.#dbs.set(options.name, this.#setup(options));
    }

    const dbPromise = this.#dbs.get(options.name);
    if (!dbPromise) {
      throw new Error(`Database ${options.name} not found`);
    }

    return dbPromise;
  }
}

export { Databases, type DatabaseMigration, type Knex, type DatabaseOptions, createDatabase, createMigration };
