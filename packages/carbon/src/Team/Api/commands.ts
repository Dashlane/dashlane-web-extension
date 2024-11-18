import {
  ComputePlanPricingRequest,
  ComputePlanPricingResponse,
  GetTeamInfoResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type TeamCommands = {
  getTeamInfo: Command<void, GetTeamInfoResult>;
  computePlanPricing: Command<
    ComputePlanPricingRequest,
    ComputePlanPricingResponse
  >;
};
