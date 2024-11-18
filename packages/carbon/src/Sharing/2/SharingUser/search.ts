import { stringProp } from "DataManagement/Search/utils";
import { match } from "DataManagement/Search/match";
import { SharingUser } from "Sharing/2/SharingUser/types";
export const searchGetters: ((a: SharingUser) => string)[] = [
  stringProp<SharingUser>("userId"),
];
export const sharingUserMatch = match(searchGetters);
