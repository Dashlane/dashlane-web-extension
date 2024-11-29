import {
  CarbonLiveResult,
  useCarbonLive,
} from "@dashlane/carbon-api-consumers";
import { ChangeMasterPasswordProgress } from "@dashlane/communication";
import { carbonConnector } from "../../libs/carbon/connector";
export function useLiveChangeMasterPasswordStatus(): CarbonLiveResult<ChangeMasterPasswordProgress> {
  return useCarbonLive(
    {
      live: carbonConnector.liveChangeMasterPasswordStatus,
    },
    []
  );
}
