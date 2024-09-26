import { MemberPermission } from "./UserGroup";
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
export type Unlimited = {
  type: "unlimited";
};
export type Limited = {
  type: "limited";
  remains: number;
};
export type SharingCapacity = Limited | Unlimited;
