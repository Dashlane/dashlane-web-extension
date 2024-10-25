import { CoreServices } from "Services";
import { removeTeamAdminItem } from "TeamAdmin/remove-team-admin-item";
export const removeAdminProvisioningKey = async (
  services: CoreServices
): Promise<{
  success: true;
}> => {
  await removeTeamAdminItem(services, "adminProvisioningKey");
  return {
    success: true,
  };
};
