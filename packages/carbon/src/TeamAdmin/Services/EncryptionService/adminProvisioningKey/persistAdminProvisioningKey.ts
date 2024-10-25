import {
  PersistAdminProvisioningKeyRequest,
  PersistAdminProvisioningKeyResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { UnknownError } from "Libs/DashlaneApi";
import { makeSharingService } from "Sharing/2/Services";
import { createOrUpdateSpecialItem } from "TeamAdmin/createOrUpdateSpecialItem";
export const persistAdminProvisioningKey = async (
  services: CoreServices,
  request: PersistAdminProvisioningKeyRequest
): Promise<PersistAdminProvisioningKeyResult> => {
  const { adminProvisioningKey } = request;
  const sharingService = makeSharingService(
    services.storeService,
    services.wsService
  );
  try {
    const persistedValue = await createOrUpdateSpecialItem<{
      adminProvisioningKey: string;
    }>(services, sharingService, { adminProvisioningKey });
    if (!persistedValue) {
      return {
        success: false,
        error: "failed to persist adminProvisioningKey",
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
