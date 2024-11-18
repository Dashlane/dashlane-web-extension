import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useModuleQuery } from "@dashlane/framework-react";
import { autofillSettingsApi } from "@dashlane/autofill-contracts";
import { useProtectPasswordsSetting } from "../api/protectedItemsUnlocker/useProtectPasswordsSetting";
export function useCredentialPasswordIsProtected(
  credentialId: string
): boolean | null {
  const mpSettingsResponse = useProtectPasswordsSetting();
  const { data, status } = useModuleQuery(
    autofillSettingsApi,
    "getPreferencesForCredentials",
    { credentialIds: [credentialId] }
  );
  if (
    mpSettingsResponse.status !== DataStatus.Success ||
    status !== DataStatus.Success
  ) {
    return null;
  }
  const globallyRequireMP = mpSettingsResponse.data;
  return data[0].requireMasterPassword || globallyRequireMP;
}
