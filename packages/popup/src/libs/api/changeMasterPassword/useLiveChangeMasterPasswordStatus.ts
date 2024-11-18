import {
  CarbonLiveResult,
  useCarbonLive,
} from "@dashlane/carbon-api-consumers";
import type { ChangeMasterPasswordProgress } from "@dashlane/communication";
import { carbonConnector } from "../../../carbonConnector";
export function useLiveChangeMasterPasswordStatus(): CarbonLiveResult<ChangeMasterPasswordProgress> {
  return useCarbonLive(
    {
      live: carbonConnector.liveChangeMasterPasswordStatus,
    },
    []
  );
}
