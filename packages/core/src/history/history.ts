import { addMessages } from "./capabilites/add-messages.js";
import { get } from "./capabilites/get.js";
import { list } from "./capabilites/list.js";
import { set } from "./capabilites/set.js";
import { historyUpdatedEvent } from "./events/updated.js";

const history = {
  list,
  get,
  addMessages,
  set,
};

const historyEvents = {
  updated: historyUpdatedEvent,
}

export { history, historyEvents };
