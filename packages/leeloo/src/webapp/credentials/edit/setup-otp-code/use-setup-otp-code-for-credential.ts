import { useModuleCommands } from "@dashlane/framework-react";
import { otpApi } from "@dashlane/password-security-contracts";
export const useSetupOtpCodeForCredential = () => {
  const { setupOtpCodeForCredential } = useModuleCommands(otpApi);
  const setupOtpCode = async (credentialId: string, otpUrl: string) => {
    try {
      await setupOtpCodeForCredential({ credentialId, otpUrl });
      return true;
    } catch {
      return false;
    }
  };
  return { setupOtpCode };
};
