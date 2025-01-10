import { createExtension } from "@bitler/core";
import { addDocument } from "./capabilites/add-document.js";
import { findDocuments } from "./capabilites/find-documents.js";
import { getSources } from "./capabilites/get-sources.js";
import { getTypes } from "./capabilites/get-types.js";
import { removeDocuments } from "./capabilites/remove-documents.js";
import { agent } from "./agents/agent.js";

const jsonDocuments = createExtension({
  agents: [
    agent,
  ],
  capabilities: [
    addDocument,
    findDocuments,
    getSources,
    getTypes,
    removeDocuments,
  ],
});

export { jsonDocuments, addDocument, findDocuments, getSources, getTypes, removeDocuments };
