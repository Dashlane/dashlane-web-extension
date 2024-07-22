import {
  ItemGroupDownload,
  Permission,
  Status,
  UserDownload,
} from "@dashlane/server-sdk/v1";
import { ItemGroupDownload as CarbonItemGroupDownload } from "@dashlane/sharing";
import { TypeOfArray } from "../../utils/type-of-array";
function convertPermission(
  carbonUserDownloadPermission: TypeOfArray<
    CarbonItemGroupDownload["users"]
  >["permission"]
) {
  switch (carbonUserDownloadPermission) {
    case "admin":
      return Permission.Admin;
    case "limited":
      return Permission.Limited;
  }
}
function convertStatus(
  carbonUserDownloadStatus: TypeOfArray<
    CarbonItemGroupDownload["users"]
  >["status"]
) {
  switch (carbonUserDownloadStatus) {
    case "pending":
      return Status.Pending;
    case "accepted":
      return Status.Accepted;
    case "refused":
      return Status.Refused;
    case "revoked":
      return Status.Revoked;
  }
}
export function convertCarbonItemGroupDownload(
  carbonItemGroupDownload: CarbonItemGroupDownload
): ItemGroupDownload {
  return {
    groupId: carbonItemGroupDownload.groupId,
    revision: carbonItemGroupDownload.revision,
    type: carbonItemGroupDownload.type,
    teamId: carbonItemGroupDownload.teamId,
    items: carbonItemGroupDownload.items,
    users: carbonItemGroupDownload.users
      ? [
          ...carbonItemGroupDownload.users.map((user) => {
            const convertedUserDownload: UserDownload = {
              ...user,
              permission: convertPermission(user.permission),
              status: convertStatus(user.status),
            };
            return convertedUserDownload;
          }),
        ]
      : undefined,
    groups: carbonItemGroupDownload.groups
      ? [
          ...carbonItemGroupDownload.groups.map((group) => {
            const convertedGroupDownload: TypeOfArray<
              ItemGroupDownload["groups"]
            > = {
              ...group,
              permission: convertPermission(group.permission),
              status: convertStatus(group.status),
            };
            return convertedGroupDownload;
          }),
        ]
      : undefined,
    collections: (carbonItemGroupDownload as ItemGroupDownload).collections
      ? [
          ...((carbonItemGroupDownload as ItemGroupDownload).collections?.map(
            (group) => {
              const convertedGroupDownload: TypeOfArray<
                ItemGroupDownload["collections"]
              > = {
                ...group,
                permission: convertPermission(group.permission),
                status: convertStatus(group.status),
              };
              return convertedGroupDownload;
            }
          ) ?? []),
        ]
      : undefined,
  };
}
