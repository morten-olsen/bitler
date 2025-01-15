import { createAgent } from '@bitler/llm';

import { search } from '../capabilities/search.js';
import { play } from '../capabilities/play.js';
import { pause } from '../capabilities/pause.js';
import { setVolume } from '../capabilities/set-volume.js';
import { status } from '../capabilities/status.js';
import { previous } from '../capabilities/previous.js';
import { next } from '../capabilities/next.js';
import { resume } from '../capabilities/resume.js';

const agent = createAgent({
  kind: 'music.agent',
  name: 'Music',
  capabilities: [
    search.kind,
    play.kind,
    pause.kind,
    setVolume.kind,
    status.kind,
    previous.kind,
    next.kind,
    resume.kind,
  ],
});

export { agent };
