import { defaultTo } from "ramda";
import { SharingUserView } from "@dashlane/communication";
import { SharingUser } from "Sharing/2/SharingUser/types";
const defaultToEmptyString = defaultTo("");
export const detailView = (user: SharingUser): SharingUserView => {
  return {
    id: defaultToEmptyString(user.userId),
    itemCount: user.itemCount,
  };
};
export const listView = (sharingUsers: SharingUser[]): SharingUserView[] =>
  sharingUsers.map(detailView);
