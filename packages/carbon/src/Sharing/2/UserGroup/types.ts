import {
  Mappers,
  UserGroupDownload,
  UserGroupFilterField,
  UserGroupSortField,
} from "@dashlane/communication";
export interface UserGroup extends UserGroupDownload {
  itemCount: number;
}
export type UserGroupMappers = Mappers<
  UserGroup,
  UserGroupSortField,
  UserGroupFilterField
>;
