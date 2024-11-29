import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { NonMembersList, teamMembersApi } from "@dashlane/team-admin-contracts";
const EMPTY_NON_MEMBERS_LIST: NonMembersList = [];
export const useNonMembersList = (): {
  shouldShowNonMembersInfobox: boolean;
  nonMembersCount: number;
  nonMembersList: NonMembersList;
} => {
  const getNonMembersCountResult = useModuleQuery(
    teamMembersApi,
    "getNonMembersCount"
  );
  const getHasAdminDismissedInfobox = useModuleQuery(
    teamMembersApi,
    "getHasAdminDismissedInfobox"
  );
  const getNonMembersListResult = useModuleQuery(
    teamMembersApi,
    "getNonMembersList"
  );
  return {
    shouldShowNonMembersInfobox:
      getNonMembersCountResult.status === DataStatus.Success &&
      getHasAdminDismissedInfobox.status === DataStatus.Success &&
      getNonMembersCountResult.data > 0 &&
      !getHasAdminDismissedInfobox.data,
    nonMembersCount:
      getNonMembersCountResult.status === DataStatus.Success &&
      getHasAdminDismissedInfobox.status === DataStatus.Success
        ? getNonMembersCountResult.data
        : 0,
    nonMembersList:
      getNonMembersListResult.status === DataStatus.Success
        ? getNonMembersListResult.data
        : EMPTY_NON_MEMBERS_LIST,
  };
};
