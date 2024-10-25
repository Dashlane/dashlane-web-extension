import { ItemContent, SharingData } from "@dashlane/communication";
import { safeCast } from "@dashlane/framework-types";
import { ItemGroupDownload, UserGroupDownload } from "@dashlane/sharing";
export interface TeamAdminSharingData {
  specialItemGroup?: ItemGroupDownload;
  specialUserGroup?: UserGroupDownload;
  specialItems?: Record<string, ItemContent>;
}
export const mapToTeamAdminSharingData = (sharingData: SharingData) => {
  const specialItemGroup = sharingData.itemGroups.find(
    (itemGroup) => itemGroup.type === "userGroupKeys"
  );
  const specialUserGroup = sharingData.userGroups.find(
    (userGroup) => userGroup.type === "teamAdmins"
  );
  const specialItems = specialItemGroup?.items?.reduce((acc, { itemId }) => {
    acc[itemId] = sharingData.items.find((item) => item.itemId === itemId);
    return acc;
  }, safeCast<Record<string, ItemContent>>({}));
  return { specialItemGroup, specialUserGroup, specialItems };
};
