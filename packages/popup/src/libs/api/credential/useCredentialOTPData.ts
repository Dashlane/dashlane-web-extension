import { useModuleQuery } from "@dashlane/framework-react";
import { otpApi } from "@dashlane/password-security-contracts";
export function useCredentialOTPData(credentialId: string) {
  return useModuleQuery(otpApi, "otpCode", { credentialId });
}
