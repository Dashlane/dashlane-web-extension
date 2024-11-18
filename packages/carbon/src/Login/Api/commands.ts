import { SSOCommands } from "Login/SSO/sso.commands";
import { DeviceLimitCommands } from "Login/DeviceLimit/device-limit.commands";
export type LoginCommands = SSOCommands & DeviceLimitCommands;
