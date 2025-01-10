import { createAgent } from "@bitler/core";
import { addDocument, findDocuments, getSources, getTypes, removeDocuments } from "../exports.js";

const agent = createAgent({
  kind: 'json-documents',
  name: 'JSON Documents',
  description: 'Agent for JSON Documents',
  capabilities: [
    addDocument.kind,
    findDocuments.kind,
    getSources.kind,
    getTypes.kind,
    removeDocuments.kind,
  ]
});

export { agent };
