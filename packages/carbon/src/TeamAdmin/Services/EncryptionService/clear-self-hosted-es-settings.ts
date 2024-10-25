import {
  AuthenticationCode,
  ClearSelfHostedESSettingsResult,
  ClearSelfHostedESSettingsWarning,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  BasicConfigNotFound,
  DeactivatedTeamDevice,
  NotAdmin,
  UnknownError,
} from "Libs/DashlaneApi";
import { getCurrentUserInfo } from "Session/utils";
import { setTeamSettings } from "Team/SettingsController";
import { requireAdmin } from "TeamAdmin/Services/EncryptionService/requireAdmin";
import { deactivateTeamDevice } from "TeamAdmin/Services/Device/deactivateTeamDevice";
import { currentTeamIdSelector } from "../selectors";
import { clearEncryptionServiceConfig } from "./EncryptionServiceConfig/clear-encryption-service-config";
import { getEncryptionServiceConfig } from "./EncryptionServiceConfig/getEncryptionServiceConfig";
export const clearSelfHostedESSettings = async (
  services: CoreServices
): Promise<ClearSelfHostedESSettingsResult> => {
  const { storeService, wsService } = services;
  try {
    requireAdmin(storeService);
  } catch (e) {
    if (
      e.message === AuthenticationCode[AuthenticationCode.USER_UNAUTHORIZED]
    ) {
      return {
        success: false,
        error: { code: NotAdmin },
      };
    }
  }
  const currentConfig = await getEncryptionServiceConfig(services);
  const warnings: ClearSelfHostedESSettingsWarning[] = [];
  if (currentConfig.success) {
    if (currentConfig.data.config) {
      await clearEncryptionServiceConfig(services);
    }
    if (currentConfig.data.deviceAccessKey) {
      const deactivateDeviceResponse = await deactivateTeamDevice(services, {
        teamDeviceAccessKey: currentConfig.data.deviceAccessKey,
      });
      if (!deactivateDeviceResponse.success) {
        return {
          success: false,
          error: { code: DeactivatedTeamDevice },
        };
      }
    }
  } else {
    warnings.push(BasicConfigNotFound);
  }
  const teamId = parseInt(currentTeamIdSelector(storeService.getState()), 10);
  const teamSettingsResponse = await setTeamSettings(
    storeService,
    wsService,
    getCurrentUserInfo(storeService),
    {
      teamId,
      settings: {
        ssoServiceProviderUrl: null,
        ssoIdpMetadata: null,
        ssoIdpEntrypoint: null,
      },
    }
  );
  if (teamSettingsResponse.error) {
    return {
      success: false,
      error: { code: UnknownError },
    };
  }
  return {
    success: true,
    ...(warnings ? { warnings } : {}),
  };
};
