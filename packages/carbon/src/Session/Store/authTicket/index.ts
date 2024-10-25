import { Action } from "Store";
import {
  ADD_AUTH_TICKET_DATA,
  AuthTicketInfo,
  RESET_AUTH_TICKET_DATA,
} from "Session/Store/authTicket/types";
export const getEmptyAuthTicketInfo = (): AuthTicketInfo => ({
  login: null,
  date: 0,
  authTicket: null,
});
export default (state = getEmptyAuthTicketInfo(), action: Action) => {
  switch (action.type) {
    case ADD_AUTH_TICKET_DATA:
      return {
        ...state,
        ...action.data,
      };
    case RESET_AUTH_TICKET_DATA:
      return {
        ...state,
        ...getEmptyAuthTicketInfo(),
      };
    default:
      return state;
  }
};
