import { stringProp } from "DataManagement/Search/utils";
import { match } from "DataManagement/Search/match";
import { UserGroup } from "Sharing/2/UserGroup/types";
export const searchGetters: ((a: UserGroup) => string)[] = [
  stringProp<UserGroup>("name"),
];
export const userGroupMatch = match(searchGetters);
