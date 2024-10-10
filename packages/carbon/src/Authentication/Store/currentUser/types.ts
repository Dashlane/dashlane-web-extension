import { RememberMeType } from "@dashlane/communication";
import { DeviceKeys } from "Store/helpers/Device";
export interface AuthTicketInfo {
  login: string;
  date: number;
  authTicket: string;
}
export interface CurrentUserAuthenticationState {
  deviceKeys: DeviceKeys;
  rememberMeType: RememberMeType;
}
