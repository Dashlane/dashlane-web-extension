import { ActivateVpnAccountRequest } from "@dashlane/communication";
import { Command } from "Shared/Api";
export type VpnCommands = {
  activateVpnAccount: Command<ActivateVpnAccountRequest, void>;
  clearVpnAccountErrors: Command<void, void>;
  completeVpnAccountActivation: Command<void, void>;
};
