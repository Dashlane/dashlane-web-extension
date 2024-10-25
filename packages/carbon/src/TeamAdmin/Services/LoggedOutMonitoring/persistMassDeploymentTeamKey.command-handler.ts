import {
  PersistMassDeploymentTeamKeyRequest,
  PersistMassDeploymentTeamKeyResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { UnknownError } from "Libs/DashlaneApi";
import { makeSharingService } from "Sharing/2/Services";
import { createOrUpdateSpecialItem } from "TeamAdmin/createOrUpdateSpecialItem";
export const persistMassDeploymentTeamKey = async (
  services: CoreServices,
  request: PersistMassDeploymentTeamKeyRequest
): Promise<PersistMassDeploymentTeamKeyResult> => {
  const { massDeploymentTeamAccessKey, massDeploymentTeamSecretKey } = request;
  const sharingService = makeSharingService(
    services.storeService,
    services.wsService
  );
  try {
    const persistedValue = await createOrUpdateSpecialItem<{
      massDeploymentTeamAccessKey: string;
      massDeploymentTeamSecretKey: string;
    }>(services, sharingService, {
      massDeploymentTeamAccessKey,
      massDeploymentTeamSecretKey,
    });
    if (!persistedValue) {
      return {
        success: false,
        error: "failed to persist massDeploymentTeamKey credentials",
      };
    }
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      error: `${e?.message ?? UnknownError}`,
    };
  }
};
