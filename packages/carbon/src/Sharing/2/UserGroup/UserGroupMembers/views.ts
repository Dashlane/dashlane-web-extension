import { defaultTo } from "ramda";
import { UserDownload } from "@dashlane/sharing/types/serverResponse";
import { UserGroupMemberView } from "@dashlane/communication";
const defaultToEmptyString = defaultTo("");
export const detailView = (user: UserDownload): UserGroupMemberView => {
  return {
    id: defaultToEmptyString(user.userId),
    permission: user.permission,
  };
};
export const listView = (
  userDownloads: UserDownload[]
): UserGroupMemberView[] => userDownloads.map(detailView);
