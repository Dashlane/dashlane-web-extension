import {
  Permission,
  Status,
  UserDownload,
  UserGroupDownload,
} from "@dashlane/server-sdk/v1";
import { UserGroupDownload as CarbonUserGroupDownload } from "@dashlane/sharing";
import { TypeOfArray } from "../../utils/type-of-array";
function convertPermission(
  carbonUserDownloadPermission: TypeOfArray<
    CarbonUserGroupDownload["users"]
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
    CarbonUserGroupDownload["users"]
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
export function convertCarbonUserGroupDownload(
  carbonUserGroupDownload: CarbonUserGroupDownload
): UserGroupDownload {
  return {
    groupId: carbonUserGroupDownload.groupId,
    revision: carbonUserGroupDownload.revision,
    type: carbonUserGroupDownload.type,
    teamId: carbonUserGroupDownload.teamId,
    name: carbonUserGroupDownload.name,
    privateKey: carbonUserGroupDownload.privateKey,
    publicKey: carbonUserGroupDownload.publicKey,
    externalId: carbonUserGroupDownload.externalId,
    familyId: carbonUserGroupDownload.familyId,
    users: [
      ...carbonUserGroupDownload.users.map((user) => {
        const convertedUserDownload: UserDownload = {
          ...user,
          permission: convertPermission(user.permission),
          status: convertStatus(user.status),
        };
        return convertedUserDownload;
      }),
    ],
  };
}
