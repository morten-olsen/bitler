import { Capabilities, createExtension } from "@bitler/core";
import { listKnowledgeBasesCapability } from "./capabilities/capabilities.list.js";
import { createKnowledgeBaseCapability } from "./capabilities/capabilities.create.js";
import { addDocumentCapability } from "./capabilities/capabilities.add-document.js";
import { searchDocuments } from "./capabilities/capabilities.search.js";

const knowledgeBases = createExtension({
  setup: async ({ container }) => {
    const capabilitiesService = container.get(Capabilities);
    capabilitiesService.register([
      listKnowledgeBasesCapability,
      createKnowledgeBaseCapability,
      addDocumentCapability,
      searchDocuments,
    ])
  },
});

export { knowledgeBases };
