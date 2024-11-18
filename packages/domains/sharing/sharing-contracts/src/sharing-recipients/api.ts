import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  GetAllAcceptedGroupsQuery,
  GetSharingGroupByIdQuery,
  GetSharingGroupsWithItemCountQuery,
  GetSharingUsersQuery,
} from "./queries";
export const sharingRecipientsApi = defineModuleApi({
  name: "sharingRecipients" as const,
  commands: {},
  events: {},
  queries: {
    getAllAcceptedGroupsQuery: GetAllAcceptedGroupsQuery,
    getSharingUsersQuery: GetSharingUsersQuery,
    getSharingGroupsWithItemCountQuery: GetSharingGroupsWithItemCountQuery,
    getSharingGroupByIdQuery: GetSharingGroupByIdQuery,
  },
});
