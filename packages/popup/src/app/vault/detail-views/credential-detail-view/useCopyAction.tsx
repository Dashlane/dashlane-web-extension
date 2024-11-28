import { VaultItemType } from "@dashlane/vault-contracts";
import { Field } from "@dashlane/hermes";
import { useAlertAutofillEngine } from "../../../use-autofill-engine";
import { copyItemToClipboard } from "../helpers";
import { ToastSettings } from "@dashlane/design-system";
interface UseCopyActionParams {
  toastString: string;
  showToast: (settings: ToastSettings) => string;
  value: string;
  itemType: VaultItemType;
  field: Field;
  itemId: string;
  isProtected?: boolean;
  itemUrl?: string;
}
export function useCopyAction({
  toastString,
  showToast,
  value,
  itemType,
  field,
  itemId,
  isProtected,
}: UseCopyActionParams) {
  const alertAutofillEngine = useAlertAutofillEngine();
  return async () => {
    void alertAutofillEngine(itemId, value, itemType, field);
    await copyItemToClipboard({
      value: value,
      itemType: itemType,
      itemId: itemId,
      field: field,
      isProtected: isProtected,
    }).then(() => {
      showToast({
        description: toastString,
      });
    });
  };
}
