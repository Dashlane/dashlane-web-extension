import { CoreServices } from "Services";
import { ISharingServices } from "Sharing/2/Services";
import { createOrUpdateSpecialItem } from "TeamAdmin/createOrUpdateSpecialItem";
export const persistSSOConnectorKey = async (
  services: CoreServices,
  sharingService: ISharingServices,
  ssoConnectorKey: string
): Promise<string> => {
  const persisted = await createOrUpdateSpecialItem<{
    ssoConnectorKey: string;
  }>(services, sharingService, { ssoConnectorKey });
  return persisted.ssoConnectorKey;
};
