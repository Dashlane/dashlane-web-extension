import { CoreServices } from "Services";
import { removeTeamAdminItem } from "TeamAdmin/remove-team-admin-item";
export const clearEncryptionServiceConfig = async (
  services: CoreServices
): Promise<boolean> => {
  await removeTeamAdminItem(services, "encryptionServiceData");
  return true;
};
