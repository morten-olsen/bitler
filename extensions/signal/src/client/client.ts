import createBaseClient from 'openapi-fetch';

import { paths } from '../generated/api.js';
import { host, secure } from '../config.js';

const createClient = () => {
  const client = createBaseClient<paths>({
    baseUrl: `${secure ? 'https' : 'http'}://${host}`,
  });

  return client;
};

type Client = ReturnType<typeof createClient>;

export { createClient, type Client };
