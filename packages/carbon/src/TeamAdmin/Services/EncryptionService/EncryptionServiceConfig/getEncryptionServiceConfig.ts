import { GetEncryptionServiceConfigResult } from "@dashlane/communication";
import { CoreServices } from "Services";
import { BasicConfigNotFound, UnknownError } from "Libs/DashlaneApi";
import {
  adminDataForTeamSelector,
  currentTeamIdSelector,
} from "TeamAdmin/Services/selectors";
import { requireAdmin } from "../requireAdmin";
export const getEncryptionServiceConfig = ({
  storeService,
}: CoreServices): Promise<GetEncryptionServiceConfigResult> => {
  requireAdmin(storeService);
  try {
    const currentTeamId = currentTeamIdSelector(storeService.getState());
    const adminData = adminDataForTeamSelector(
      storeService.getState(),
      currentTeamId
    );
    if (!adminData?.encryptionServiceData?.basicConfigs?.[0]) {
      return Promise.resolve({
        success: false,
        error: {
          code: BasicConfigNotFound,
        },
      });
    }
    return Promise.resolve({
      success: true,
      data: adminData.encryptionServiceData.basicConfigs[0],
    });
  } catch {
    return Promise.resolve({
      success: false,
      error: {
        code: UnknownError,
      },
    });
  }
};
