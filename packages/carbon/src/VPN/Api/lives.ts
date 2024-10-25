import { VpnAccountStatus } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type VpnLives = {
  liveVpnAccount: LiveQuery<void, VpnAccountStatus>;
};
