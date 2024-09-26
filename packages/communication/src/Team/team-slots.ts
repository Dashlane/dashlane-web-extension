import { slot } from "ts-event-bus";
import {
  ComputePlanPricingRequest,
  ComputePlanPricingResponse,
  GetTeamInfoResult,
} from "./types";
export const teamQueriesSlots = {
  getIsRecoveryEnabled: slot<void, boolean>(),
};
export const teamCommandsSlots = {
  getTeamInfo: slot<void, GetTeamInfoResult>(),
  computePlanPricing: slot<
    ComputePlanPricingRequest,
    ComputePlanPricingResponse
  >(),
};
