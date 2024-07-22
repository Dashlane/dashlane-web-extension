import { defineModuleApi } from "@dashlane/framework-contracts";
import { GetSharingGroupsQuery, GetSharingUsersQuery } from "./queries";
export const sharingRecipientsApi = defineModuleApi({
  name: "sharingRecipients" as const,
  commands: {},
  events: {},
  queries: {
    getSharingUsersQuery: GetSharingUsersQuery,
    getSharingGroupsQuery: GetSharingGroupsQuery,
  },
});
