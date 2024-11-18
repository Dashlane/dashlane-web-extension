import {
  VpnAccountStatus,
  VpnCapabilitySetting,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type VpnQueries = {
  getVpnAccount: Query<void, VpnAccountStatus>;
  getVpnCapabilitySetting: Query<void, VpnCapabilitySetting>;
};
