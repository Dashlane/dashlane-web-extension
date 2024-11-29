import { carbonLegacyApi } from "@dashlane/communication";
import { platformInfoApi } from "@dashlane/framework-contracts";
import { sessionApi, vaultAccessApi } from "@dashlane/session-contracts";
const availableApis = {
  platformInfoApi,
  sessionApi,
  vaultAccessApi,
  carbonLegacyApi,
};
type AvailableApis = typeof availableApis;
export type LeelooDependencies = {
  [k in keyof AvailableApis as AvailableApis[k]["name"]]: AvailableApis[k];
};
