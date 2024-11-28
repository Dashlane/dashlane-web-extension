import * as React from "react";
import { Button, useToast } from "@dashlane/design-system";
import { GeneratedPasswordItemView } from "@dashlane/communication";
import { Field, ItemType, UserCopyVaultItemFieldEvent } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import usePopupPersistedState from "../../../UIState/use-popup-persisted-state";
import { PasswordGeneratedHistoryModal } from "../password-generated-history/password-generated-history-modal";
const I18N_KEYS = {
  PASSWORD_COPIED_TO_CLIPBOARD: "tab/generate/password_copied_to_clipboard",
  SHOW_HISTORY: "tab/generate/showHistory",
};
const isGeneratedPasswordHistoryVisibleKey =
  "isGeneratedPasswordHistoryVisibleKey";
interface Props {
  generatedPasswords: GeneratedPasswordItemView[];
  onCloseModal?: () => void;
  isDisabled: boolean;
}
const GeneratedPasswordHistoryComponent = ({
  generatedPasswords,
  onCloseModal,
  isDisabled,
}: Props) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const [
    isGeneratedPasswordHistoryVisible,
    setIsGeneratedPasswordHistoryVisible,
  ] = usePopupPersistedState<boolean>(
    isGeneratedPasswordHistoryVisibleKey,
    false
  );
  const showGeneratedPasswordHistory = React.useCallback(() => {
    setIsGeneratedPasswordHistoryVisible(true);
  }, []);
  const hideGeneratedPasswordHistory = React.useCallback(() => {
    setIsGeneratedPasswordHistoryVisible(false);
    if (onCloseModal) {
      onCloseModal();
    }
  }, []);
  const copyGeneratedPaswordHistory = React.useCallback(
    async (password: string, id: string) => {
      await navigator.clipboard.writeText(password);
      void logEvent(
        new UserCopyVaultItemFieldEvent({
          field: Field.Password,
          itemType: ItemType.GeneratedPassword,
          itemId: id,
          isProtected: false,
        })
      );
      showToast({
        description: translate(I18N_KEYS.PASSWORD_COPIED_TO_CLIPBOARD),
      });
    },
    [showToast, translate]
  );
  const unfocusShowHistoryButton = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <>
      <Button
        disabled={isDisabled}
        mood="brand"
        intensity="quiet"
        onClick={showGeneratedPasswordHistory}
        onMouseDown={unfocusShowHistoryButton}
        size="small"
      >
        {translate(I18N_KEYS.SHOW_HISTORY)}
      </Button>
      <PasswordGeneratedHistoryModal
        generatedPasswords={generatedPasswords}
        isVisible={isGeneratedPasswordHistoryVisible}
        onClose={hideGeneratedPasswordHistory}
        onCopy={(password, id) => {
          void copyGeneratedPaswordHistory(password, id);
        }}
      />
    </>
  );
};
export const GeneratedPasswordHistory = React.memo(
  GeneratedPasswordHistoryComponent
);
