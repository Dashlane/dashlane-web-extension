import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Dialog } from "@dashlane/design-system";
import { useProtectPasswordsSetting } from "../../../libs/carbon/hooks/useProtectPasswordsSetting";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ProtectedItemsForm } from "./protected-items-form";
import {
  ProtectedItemsUnlockRequest,
  UnlockRequestCustomizableField,
} from "../types";
import { getUnlockRequestTranslationOption } from "../helpers";
import { allIgnoreClickOutsideClassName } from "../../variables";
const I18N_KEYS = {
  TITLE: "webapp_lock_items_label",
};
export const ProtectedItemsUnlockerDialog = ({
  unlockRequest,
  setUnlockRequest,
}: ProtectedItemsUnlockRequest) => {
  const { translate } = useTranslate();
  const protectPasswordsSetting = useProtectPasswordsSetting();
  const { options, cancelCallback } = unlockRequest;
  if (protectPasswordsSetting.status !== DataStatus.Success) {
    return null;
  }
  const handleDismiss = () => {
    cancelCallback?.();
    setUnlockRequest?.(null);
  };
  const getTitle = () => {
    const translation = getUnlockRequestTranslationOption(
      UnlockRequestCustomizableField.Title,
      options
    );
    if (translation) {
      return translation.translated
        ? translation.field
        : translate(translation.key);
    }
    return translate(I18N_KEYS.TITLE);
  };
  return (
    <Dialog
      isOpen
      stackingLevel={2}
      onClose={handleDismiss}
      closeActionLabel="Close"
      title={getTitle() as string}
      className={allIgnoreClickOutsideClassName}
    >
      <ProtectedItemsForm
        unlockRequest={unlockRequest}
        setUnlockRequest={setUnlockRequest}
        requirePasswordGlobalSetting={protectPasswordsSetting.data}
      />
    </Dialog>
  );
};
