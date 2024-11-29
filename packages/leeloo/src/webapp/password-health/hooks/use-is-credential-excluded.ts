import { useModuleCommands } from "@dashlane/framework-react";
import { passwordHealthApi } from "@dashlane/password-security-contracts";
import { useCallback } from "react";
export interface UseIsCredentialExcluded {
  updateIsCredentialExcluded: (credentialId: string, excluded: boolean) => void;
}
export const useIsCredentialExcluded = (): UseIsCredentialExcluded => {
  const { updateIsCredentialExcluded } = useModuleCommands(passwordHealthApi);
  const _updateIsCredentialExcluded = useCallback(
    (credentialId, excluded) => {
      updateIsCredentialExcluded({ credentialId, excluded });
    },
    [updateIsCredentialExcluded]
  );
  return {
    updateIsCredentialExcluded: _updateIsCredentialExcluded,
  };
};
