import {
  Mappers,
  SharingUserFilterField,
  SharingUserSortField,
} from "@dashlane/communication";
import { UserDownload } from "@dashlane/sharing/types/serverResponse";
export interface SharingUser extends UserDownload {
  itemCount: number;
}
export type SharingUserMappers = Mappers<
  SharingUser,
  SharingUserSortField,
  SharingUserFilterField
>;
