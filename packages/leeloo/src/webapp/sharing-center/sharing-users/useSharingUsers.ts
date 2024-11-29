import { useModuleQuery } from "@dashlane/framework-react";
import {
  sharingRecipientsApi,
  SortDirection,
} from "@dashlane/sharing-contracts";
export function useSharingUsers(
  sortDirection: SortDirection,
  spaceId: string | null
) {
  const sharingUsers = useModuleQuery(sharingRecipientsApi, "getSharingUsers", {
    sortDirection: sortDirection,
    spaceId: spaceId,
  });
  return sharingUsers;
}
