import { createAgent } from '@bitlerjs/llm';

import { capabilities } from '../capabilities/capabilities.js';

const agentConfig = createAgent({
  kind: 'homeassistant.config',
  name: 'Home Assistant Config',
  capabilities: [...Object.values(capabilities.config).map((a) => a.kind)],
  description: 'Used for home assistant tasks',
});

export { agentConfig };
