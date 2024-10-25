import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { activateVpnAccountHandler } from "VPN/handlers/activate-vpn-account";
import { clearVpnAccountErrorsHandler } from "VPN/handlers/clear-vpn-account-errors";
import { completeVpnAccountActivationHandler } from "VPN/handlers/complete-vpn-account-activation";
import { vpnAccountStatus$ } from "VPN/live";
import {
  vpnAccountStatusSelector,
  vpnCapabilitySettingSelector,
} from "VPN/selectors";
import { VpnCommands } from "./commands";
import { VpnLives } from "./lives";
import { VpnQueries } from "./queries";
export const vpnApiConfig: CommandQueryBusConfig<
  VpnCommands,
  VpnQueries,
  VpnLives
> = {
  commands: {
    activateVpnAccount: {
      handler: activateVpnAccountHandler,
    },
    clearVpnAccountErrors: {
      handler: clearVpnAccountErrorsHandler,
    },
    completeVpnAccountActivation: {
      handler: completeVpnAccountActivationHandler,
    },
  },
  queries: {
    getVpnAccount: {
      selector: vpnAccountStatusSelector,
    },
    getVpnCapabilitySetting: {
      selector: vpnCapabilitySettingSelector,
    },
  },
  liveQueries: {
    liveVpnAccount: {
      operator: vpnAccountStatus$,
    },
  },
};
