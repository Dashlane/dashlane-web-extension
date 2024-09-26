import { InviteLinkResponseErrorCode } from "@dashlane/communication";
export const getInviteLinkErrors: InviteLinkResponseErrorCode[] = [
  InviteLinkResponseErrorCode.NotAdmin,
  InviteLinkResponseErrorCode.InviteLinkNotFound,
  InviteLinkResponseErrorCode.TeamKeyNotFound,
  InviteLinkResponseErrorCode.UserInviteLinkNotFound,
];
