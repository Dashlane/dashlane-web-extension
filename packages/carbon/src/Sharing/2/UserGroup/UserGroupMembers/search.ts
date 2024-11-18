import { UserDownload } from "@dashlane/sharing/types/serverResponse";
import { stringProp } from "DataManagement/Search/utils";
import { match } from "DataManagement/Search/match";
export const searchGetters: ((a: UserDownload) => string)[] = [
  stringProp<UserDownload>("userId"),
];
export const userDownloadMatch = match(searchGetters);
