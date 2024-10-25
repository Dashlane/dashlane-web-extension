import { MemberPermission } from "@dashlane/communication";
export type SharingStatusItemShared = {
  isShared: true;
  permission: MemberPermission;
};
export type SharingStatusDetailShared = SharingStatusItemShared & {
  recipientsCount: number;
  groupSharing: boolean;
  lastAdmin: boolean;
};
export type NotShared = {
  isShared: false;
};
export type SharingStatusItem = SharingStatusItemShared | NotShared;
export type SharingStatusDetail = SharingStatusDetailShared | NotShared;
