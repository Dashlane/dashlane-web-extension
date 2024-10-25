import { UserDownload } from "@dashlane/sharing/types/serverResponse";
import { UserDownloadMappers } from "Sharing/2/UserGroup/UserGroupMembers/types";
export const getUserDownloadMappers = (): UserDownloadMappers => ({
  id: (a: UserDownload) => a.userId,
});
