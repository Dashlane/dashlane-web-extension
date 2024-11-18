import { autofillSettingsApi } from "@dashlane/autofill-contracts";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useModuleQuery } from "@dashlane/framework-react";
import { Permission, sharingItemsApi } from "@dashlane/sharing-contracts";
import { PasswordStatus } from "./types";
import { useProtectPasswordsSetting } from "../api/protectedItemsUnlocker/useProtectPasswordsSetting";
interface CredentialPasswordStatusOptions {
  areProtectedItemsUnlocked: boolean;
}
export function useCredentialPasswordStatus(
  credentialId: string,
  { areProtectedItemsUnlocked }: CredentialPasswordStatusOptions
): PasswordStatus {
  const mpSettingsResponse = useProtectPasswordsSetting();
  const preferencesResult = useModuleQuery(
    autofillSettingsApi,
    "getPreferencesForCredentials",
    { credentialIds: [credentialId] }
  );
  const permissionResult = useModuleQuery(
    sharingItemsApi,
    "getPermissionForItem",
    {
      itemId: credentialId,
    }
  );
  if (
    mpSettingsResponse.status !== DataStatus.Success ||
    permissionResult.status !== DataStatus.Success ||
    preferencesResult.status !== DataStatus.Success
  ) {
    return PasswordStatus.Unknown;
  }
  const requireMasterPassword = preferencesResult.data[0].requireMasterPassword;
  const hasSharedLimitedPermission =
    permissionResult.data.permission === Permission.Limited;
  if (hasSharedLimitedPermission) {
    return PasswordStatus.Limited;
  }
  if (requireMasterPassword && !areProtectedItemsUnlocked) {
    return PasswordStatus.Protected;
  }
  if (mpSettingsResponse.data && !areProtectedItemsUnlocked) {
    return PasswordStatus.Protected;
  }
  return PasswordStatus.Unlocked;
}
