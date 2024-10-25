import { SharingUser, SharingUserMappers } from "Sharing/2/SharingUser/types";
export const getSharingUserMappers = (): SharingUserMappers => ({
  id: (a: SharingUser) => a.userId,
  itemCount: (a: SharingUser) => a.itemCount,
});
