import { RevokeItemGroupMembers } from "@dashlane/sharing/types/revokeItemGroupMembers";
import { ServerResponse } from "@dashlane/sharing/types/serverResponse";
export interface SharingServerResponseWsResult {
  code: number;
  message: string;
  content: ServerResponse;
}
export type RevokeActionOrigin = "manual" | "auto_invalid";
export type RevokeItemGroupMembersWithOrigin = RevokeItemGroupMembers & {
  origin?: RevokeActionOrigin;
};
