import {
  Permission,
  SharingUserGroup,
  Status,
} from "@dashlane/sharing-contracts";
import { ItemGroupDownload } from "@dashlane/server-sdk/v1";
import { checkDirectUserAccess } from "./check-shared-item-user-access";
import { checkUserGroupAccess } from "./check-shared-item-user-group-access";
import { checkCollectionAccess } from "./check-shared-item-collection-access";
import { SharedCollectionState } from "../../sharing-collections/data-access/shared-collections.state";
import { getHighestPermission } from "../get-highest-permission";
import { AccessData } from "./item-group-adapter.types";
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
  itemGroup: ItemGroupDownload,
  login: string,
  myUserGroups: SharingUserGroup[],
  myCollections: SharedCollectionState[]
): AccessData | null => {
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
  const userGroupAccess = checkUserGroupAccess(itemGroup, myUserGroups);
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
  const collectionUserAccess = checkCollectionAccess(itemGroup, myCollections);
  return {
    ...chooseMostDirectLink(
      directUserAccess,
      userGroupAccess,
      collectionUserAccess
    ),
    permission: getHighestPermission([
      directUserAccess,
      userGroupAccess,
      collectionUserAccess,
    ]),
    otherAdminsFound,
  };
};
