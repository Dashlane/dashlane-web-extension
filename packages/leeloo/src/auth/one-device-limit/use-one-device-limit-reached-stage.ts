import {
  AbortDeviceLimitFlowResult,
  UnlinkPreviousDeviceResult,
} from "@dashlane/communication";
import { carbonConnector } from "../../libs/carbon/connector";
export interface OneDeviceLimitReachedStage {
  logOut: () => Promise<AbortDeviceLimitFlowResult>;
  unlinkPreviousDevice: () => Promise<UnlinkPreviousDeviceResult>;
}
export function useOneDeviceLimitReachedStage(): OneDeviceLimitReachedStage {
  return {
    logOut: () => carbonConnector.abortDeviceLimitFlow(),
    unlinkPreviousDevice: () => carbonConnector.unlinkPreviousDevice(),
  };
}
