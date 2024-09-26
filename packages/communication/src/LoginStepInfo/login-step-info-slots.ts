import { slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import { LoginStepInfo, UpdateLoginStepInfoRequest } from "./types";
export const loginStepInfoCommandsSlots = {
  updateLoginStepInfo: slot<UpdateLoginStepInfoRequest, void>(),
  resetLoginStepInfo: slot<void, void>(),
};
export const loginStepInfoQueriesSlots = {
  getLoginStepInfo: slot<void, LoginStepInfo>(),
};
export const loginStepInfoLiveQueriesSlots = {
  liveLoginStepInfo: liveSlot<LoginStepInfo>(),
};
