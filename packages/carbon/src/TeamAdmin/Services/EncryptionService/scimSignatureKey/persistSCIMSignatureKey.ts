import { CoreServices } from "Services";
import { SCIMSignatureKey } from "Session/Store/teamAdminData/types";
import { ISharingServices } from "Sharing/2/Services";
import { createOrUpdateSpecialItem } from "TeamAdmin/createOrUpdateSpecialItem";
export const persistSCIMSignatureKey = async (
  services: CoreServices,
  sharingService: ISharingServices,
  scimSignatureKey: string
): Promise<string> => {
  const persisted = await createOrUpdateSpecialItem<
    Omit<SCIMSignatureKey, "itemId">
  >(services, sharingService, {
    scimSignatureKey,
  });
  return persisted.scimSignatureKey;
};
