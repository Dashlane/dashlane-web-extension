import { LoginViaSSO, LoginViaSSOResult } from "@dashlane/communication";
import { Command } from "Shared/Api";
export type SSOCommands = {
  loginViaSSO: Command<LoginViaSSO, LoginViaSSOResult>;
};
