import { Capabilities, createExtension } from '@bitlerjs/core';

import { s3ListBuckets } from './capabilities/s3.list-buckets.js';
import { s3ListObjectsCapability } from './capabilities/s3.list-objects.js';
import { s3GetObjectsCapability } from './capabilities/s3.get-objects.js';

const aws = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([s3ListBuckets, s3ListObjectsCapability, s3GetObjectsCapability]);
  },
});

export { aws };
