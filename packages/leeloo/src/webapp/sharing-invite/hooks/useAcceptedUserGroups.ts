import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  SharingGroup,
  sharingRecipientsApi,
} from "@dashlane/sharing-contracts";
export const useAcceptedUserGroups = (): SharingGroup[] => {
  const result = useModuleQuery(sharingRecipientsApi, "getAllAcceptedGroups");
  return result.status === DataStatus.Success ? result.data : [];
};
