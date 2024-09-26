export interface TeamUpdatedRequest {
  teamId: number;
  action: "adminPromoted" | "adminDemoted" | "memberRevoked";
  users: string[];
}
export interface TeamUpdatedResponse {
  errors: Error[];
}
export interface RemovePersonalDataItem {
  id: string;
  ignoreSharing?: boolean;
}
export enum RemovePersonalDataItemFailureReason {
  LEAVE_SHARING_FAILED,
  FORBIDDEN_LAST_ADMIN,
  FORBIDDEN_GROUP_ITEM,
  NOT_AUTHORIZED,
  NOT_FOUND,
  INTERNAL_ERROR,
}
export interface RemovePersonalDataItemResponse {
  success: boolean;
  reason?: RemovePersonalDataItemFailureReason;
  message?: string;
}
export interface SavePersonalDataItemResponse {
  success: boolean;
  itemId: string;
}
export type UserDataBoolean = "YES" | "NO";
export interface CurrentLocationUpdated {
  country: string | null;
  isEu: boolean | null;
}
