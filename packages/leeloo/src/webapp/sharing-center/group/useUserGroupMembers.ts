import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { sharingRecipientsApi } from "@dashlane/sharing-contracts";
import { normalizeString } from "../../../libs/normalize-string";
export function useUserGroupMembers(
  groupId: string,
  searchValue: string
): string[] {
  const sharingUserGroup = useModuleQuery(
    sharingRecipientsApi,
    "getSharingGroupById",
    {
      id: groupId,
    }
  );
  if (sharingUserGroup.status !== DataStatus.Success) {
    return [];
  }
  const users = sharingUserGroup.data.users;
  const searchString = normalizeString(searchValue);
  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchString)
  );
  return filteredUsers;
}
