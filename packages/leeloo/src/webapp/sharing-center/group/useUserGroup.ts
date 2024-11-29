import { useModuleQuery } from "@dashlane/framework-react";
import { sharingRecipientsApi } from "@dashlane/sharing-contracts";
export function useUserGroup(groupId: string) {
  const sharingUserGroup = useModuleQuery(
    sharingRecipientsApi,
    "getSharingGroupById",
    {
      id: groupId,
    }
  );
  return sharingUserGroup;
}
