import { UserGroup, UserGroupMappers } from "Sharing/2/UserGroup/types";
export const getUserGroupMappers = (): UserGroupMappers => ({
  name: (a: UserGroup) => a.name,
  id: (a: UserGroup) => a.groupId,
  itemCount: (a: UserGroup) => a.itemCount,
});
