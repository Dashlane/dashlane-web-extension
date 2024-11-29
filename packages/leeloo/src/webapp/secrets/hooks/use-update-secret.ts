import { useModuleCommands } from "@dashlane/framework-react";
import { AlertSeverity } from "@dashlane/ui-components";
import {
  Secret,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import useTranslate from "../../../libs/i18n/useTranslate";
export function useUpdateSecret() {
  const { translate } = useTranslate();
  const { showAlert } = useAlert();
  const { updateVaultItem } = useModuleCommands(vaultItemsCrudApi);
  const updateSecret = async (content: Partial<Secret>, id: string) => {
    try {
      await updateVaultItem({
        vaultItemType: VaultItemType.Secret,
        content,
        id,
      });
    } catch {
      showAlert(translate("_common_generic_error"), AlertSeverity.ERROR);
    }
  };
  return updateSecret;
}
