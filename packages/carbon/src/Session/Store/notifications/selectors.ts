import { State } from "Store";
export const notificationsStatusSelector = (state: State) => {
  return state.userSession.notificationsStatus;
};
