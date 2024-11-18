import { Action } from "Store";
export const ADD_AUTH_TICKET_DATA = "ADD_AUTH_TICKET_DATA";
export const RESET_AUTH_TICKET_DATA = "RESET_AUTH_TICKET_DATA";
export interface AuthTicketInfo {
  login: string | null;
  date: number;
  authTicket: string | null;
}
export interface AuthTicketInfoAction extends Action {
  type: typeof ADD_AUTH_TICKET_DATA;
  data: AuthTicketInfo;
}
export interface AuthTicketResetAction extends Action {
  type: typeof RESET_AUTH_TICKET_DATA;
}
