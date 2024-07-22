import {
  Permission,
  SharingUserGroup,
  Status,
} from "@dashlane/sharing-contracts";
import { CollectionDownload } from "@dashlane/server-sdk/v1";
import { checkUserGroupAccess } from "./check-collection-user-group-access";
import { checkDirectUserAccess } from "./check-collection-user-access";
import { CollectionAccessData } from "./collection-access-types";
const checkAdminAccepted = ({
  permission,
  status,
}: {
  permission: Permission;
  status: Status;
}) => permission === Permission.Admin && status === Status.Accepted;
export const crawlForAccessData = (
  collection: CollectionDownload,
  login: string,
  allUserGroups: SharingUserGroup[]
): CollectionAccessData => {
  const directUserAccess = checkDirectUserAccess(collection, login);
  const otherAdminsFound =
    Boolean(directUserAccess?.otherAdminsFound) ||
    Boolean(collection.userGroups?.some(checkAdminAccepted)) ||
    Boolean(collection.users?.some(checkAdminAccepted));
  if (
    directUserAccess !== null &&
    directUserAccess.permission === Permission.Admin
  ) {
    return {
      ...directUserAccess,
      otherAdminsFound,
    };
  }
  const myUserGroups = allUserGroups.filter((userGroup) =>
    userGroup.users.some(
      (user) =>
        user.userId === login &&
        user.status === Status.Accepted &&
        user.groupKey
    )
  );
  const userGroupAccess = checkUserGroupAccess(collection, login, myUserGroups);
  return {
    ...(directUserAccess?.link ? directUserAccess : userGroupAccess),
    permission:
      userGroupAccess?.permission === Permission.Admin ||
      directUserAccess?.permission === Permission.Admin
        ? Permission.Admin
        : Permission.Limited,
    otherAdminsFound,
  };
};
