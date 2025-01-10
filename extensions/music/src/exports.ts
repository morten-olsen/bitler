import { createExtension } from "@bitler/core";
import { search } from "./capabilities/search.js";
import { agent } from "./agents/agent.js";
import { play } from "./capabilities/play.js";
import { setVolume } from "./capabilities/set-volume.js";
import { pause } from "./capabilities/pause.js";
import { status } from "./capabilities/status.js";
import { previous } from "./capabilities/previous.js";
import { next } from "./capabilities/next.js";
import { resume } from "./capabilities/resume.js";

const music = createExtension({
  agents: [
    agent,
  ],
  capabilities: [
    search,
    play,
    pause,
    setVolume,
    status,
    previous,
    next,
    resume,
  ]
})

export { music }
