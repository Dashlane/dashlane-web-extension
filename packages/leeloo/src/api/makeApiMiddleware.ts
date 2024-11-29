import Api from "./Api";
import { StrongAuth } from ".";
import { TeamPlans } from "./teamPlans";
import { GlobalState } from "../store/types";
import { getAuth } from "../user";
export interface ApiMiddlewareMethods {
  strongAuth?: {
    uploadDuoCsv: Function;
  };
  teamPlans?: {
    computePlanPricing: Function;
    getADToken: Function;
    setSettings: Function;
  };
}
export function makeApiMiddleware(
  globalState: GlobalState
): ApiMiddlewareMethods {
  const auth = getAuth(globalState);
  if (!auth) {
    return {};
  }
  const api = new Api(auth);
  return {
    strongAuth: new StrongAuth(api),
    teamPlans: new TeamPlans(api),
  };
}
