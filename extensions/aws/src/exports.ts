import { Capabilities, Configs, createExtension } from '@bitlerjs/core';

import { s3ListBuckets } from './capabilities/s3.list-buckets.js';
import { s3ListObjectsCapability } from './capabilities/s3.list-objects.js';
import { s3GetObjectsCapability } from './capabilities/s3.get-objects.js';
import { awsConfig } from './configs/configs.js';

const aws = createExtension({
  setup: async ({ container }) => {
    const configsService = container.get(Configs);
    const capabilitiesService = container.get(Capabilities);
    configsService.register([awsConfig]);

    configsService.use(awsConfig, (config) => {
      if (!config || !config.enabled) {
        capabilitiesService.unregister([s3ListBuckets.kind, s3ListObjectsCapability.kind, s3GetObjectsCapability.kind]);
      } else {
        capabilitiesService.register([s3ListBuckets, s3ListObjectsCapability, s3GetObjectsCapability]);
      }
    });
  },
});

export { aws };
