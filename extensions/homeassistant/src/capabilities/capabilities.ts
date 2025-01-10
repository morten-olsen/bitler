import { config } from "./config/config.js";
import { lights } from "./lights/lights.js";

const capabilities = {
  lights,
  config,
};

export { capabilities };
