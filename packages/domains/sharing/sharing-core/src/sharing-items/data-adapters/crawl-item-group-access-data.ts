import {
  Permission,
  SharedCollection,
  Status,
} from "@dashlane/sharing-contracts";
import { UserGroupDownload } from "@dashlane/server-sdk/v1";
import { ItemGroup } from "../../sharing-common/sharing.types";
import { AccessData } from "./item-group-adapter.types";
import { checkCollectionUserAccess } from "./check-collection-user-access";
import { checkCollectionUserGroupAccess } from "./check-collection-user-group-access";
import { checkUserGroupAccess } from "./check-user-group-access";
import { checkDirectUserAccess } from "./check-user-access";
const chooseMostDirectLink = (
  ...list: (AccessData | null)[]
): AccessData | null => list.find((access) => access?.link) ?? list[0];
const checkAdminAccepted = ({
  permission,
  status,
}: {
  permission: Permission;
  status: Status;
}) => permission === Permission.Admin && status === Status.Accepted;
export const crawlForAccessData = (
  itemGroup: ItemGroup,
  login: string,
  allUserGroups: UserGroupDownload[],
  allCollections: SharedCollection[]
): AccessData => {
  const directUserAccess = checkDirectUserAccess(itemGroup, login);
  const otherAdminsFound =
    Boolean(directUserAccess?.otherAdminsFound) ||
    Boolean(itemGroup.groups?.some(checkAdminAccepted)) ||
    Boolean(itemGroup.collections?.some(checkAdminAccepted));
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
        !user.proposeSignatureUsingAlias &&
        user.groupKey
    )
  );
  const userGroupAccess = checkUserGroupAccess(itemGroup, login, myUserGroups);
  if (
    userGroupAccess !== null &&
    userGroupAccess.permission === Permission.Admin
  ) {
    return {
      ...chooseMostDirectLink(directUserAccess, userGroupAccess),
      permission: Permission.Admin,
      otherAdminsFound,
    };
  }
  const collectionUserAccess = checkCollectionUserAccess(
    itemGroup,
    login,
    allCollections
  );
  if (
    collectionUserAccess !== null &&
    collectionUserAccess.permission === Permission.Admin
  ) {
    return {
      ...chooseMostDirectLink(
        directUserAccess,
        userGroupAccess,
        collectionUserAccess
      ),
      permission: Permission.Admin,
      otherAdminsFound,
    };
  }
  const collectionUserGroupAccess = checkCollectionUserGroupAccess(
    itemGroup,
    login,
    myUserGroups,
    allCollections
  );
  return {
    ...chooseMostDirectLink(
      directUserAccess,
      userGroupAccess,
      collectionUserAccess,
      collectionUserGroupAccess
    ),
    permission: collectionUserGroupAccess?.permission ?? Permission.Limited,
    otherAdminsFound,
  };
};
