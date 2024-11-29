import { Auth as APIAuth } from "../libs/api/types";
import { Permissions } from "./permissions";
export type Auth = APIAuth;
interface Device {
  externalDeviceId: string;
}
interface Session {
  anonymousUserId: string;
  login: string | null;
  password: string | null;
  permissions: Permissions;
  sessionId: number;
  uki: string | null;
}
interface State {
  device: Device;
  session: Session;
}
export default State;
