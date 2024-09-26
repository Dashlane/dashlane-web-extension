import { DataModelType } from "@dashlane/communication";
export type UploadChangeAction = "EDIT" | "REMOVE";
export enum UploadChangeStatus {
  ReadyForNextSync = "ReadyForNextSync",
  ScheduledForSync = "ScheduledForSync",
}
export interface UploadChange {
  itemId: string;
  kwType: DataModelType;
  action: UploadChangeAction;
  status: UploadChangeStatus;
}
