import { Capabilities, createExtension } from '@bitler/core';

import { addDocument } from './capabilites/add-document.js';
import { findDocuments } from './capabilites/find-documents.js';
import { getSources } from './capabilites/get-sources.js';
import { getTypes } from './capabilites/get-types.js';
import { removeDocuments } from './capabilites/remove-documents.js';

const jsonDocuments = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([addDocument, findDocuments, getSources, getTypes, removeDocuments]);
  },
});

export { jsonDocuments, addDocument, findDocuments, getSources, getTypes, removeDocuments };
