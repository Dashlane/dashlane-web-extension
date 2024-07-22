import { Permission } from "@dashlane/sharing-contracts";
export interface Member {
  permission: Permission;
}
const reducer = (prev: Permission, next: Member | null): Permission =>
  next?.permission === Permission.Admin ? next.permission : prev;
export const getHighestPermission = (list: (Member | null)[]) =>
  list.reduce(reducer, Permission.Limited);
