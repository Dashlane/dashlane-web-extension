import {
  UpdateTeamSettingsRequest,
  UpdateTeamSettingsResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { getCurrentUserInfo } from "Session/utils";
import { getCurrentSpaceId } from "Store/helpers/spaceData";
import { setTeamSettings } from "Team/SettingsController";
export const updateTeamSettings = async (
  services: CoreServices,
  params: UpdateTeamSettingsRequest
): Promise<UpdateTeamSettingsResult> => {
  const teamId = getCurrentSpaceId(services.storeService.getSpaceData());
  const teamSettingsResult = await setTeamSettings(
    services.storeService,
    services.wsService,
    getCurrentUserInfo(services.storeService),
    { teamId, settings: params }
  );
  return teamSettingsResult.error
    ? {
        success: false,
        error: teamSettingsResult.error.message,
      }
    : {
        success: true,
      };
};
