import {
  ADD_AUTH_TICKET_DATA,
  AuthTicketInfo,
  AuthTicketInfoAction,
  AuthTicketResetAction,
  RESET_AUTH_TICKET_DATA,
} from "Session/Store/authTicket/types";
export const updateAuthTicketInfo = (
  data: AuthTicketInfo
): AuthTicketInfoAction => ({
  type: ADD_AUTH_TICKET_DATA,
  data,
});
export const resetAuthTicketInfo = (): AuthTicketResetAction => ({
  type: RESET_AUTH_TICKET_DATA,
});
