import {
  RefreshU2FDevicesResult,
  RemoveU2FAuthenticatorRequest,
  RemoveU2FAuthenticatorResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type U2FAuthenticatorsCommands = {
  refreshU2FDevicesList: Command<void, RefreshU2FDevicesResult>;
  removeU2FAuthenticator: Command<
    RemoveU2FAuthenticatorRequest,
    RemoveU2FAuthenticatorResult
  >;
};
