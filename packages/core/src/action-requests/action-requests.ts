import { ActionRequest } from "./action-requests.action.js";
import { ActionRequestInstance } from "./action-requests.instance.js";

class ActionRequests {
  #actionRequests: Set<ActionRequest<any>> = new Set();

  public register = (actionRequests: ActionRequest<any>[]) => {
    actionRequests.forEach((actionRequest) => {
      this.#actionRequests.add(actionRequest);
    });
  }

  public get = (kind: string) => {
    return Array.from(this.#actionRequests).find((actionRequest) => actionRequest.kind === kind);
  }

  public create = () => {
    return new ActionRequestInstance();
  }

  public list = () => {
    return Array.from(this.#actionRequests);
  }
}

export * from "./action-requests.action.js";
export * from "./action-requests.instance.js";
export { ActionRequests };
