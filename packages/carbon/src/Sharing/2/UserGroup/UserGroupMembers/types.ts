import {
  Mappers,
  UserGroupMembersFilterField,
  UserGroupMembersSortField,
} from "@dashlane/communication";
import { UserDownload } from "@dashlane/sharing/types/serverResponse";
export type UserDownloadMappers = Mappers<
  UserDownload,
  UserGroupMembersSortField,
  UserGroupMembersFilterField
>;
