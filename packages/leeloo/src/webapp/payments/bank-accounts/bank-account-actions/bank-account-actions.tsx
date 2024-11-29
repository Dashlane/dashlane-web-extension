import { MouseEventHandler } from "react";
import {
  DropdownContent,
  DropdownMenu,
  DropdownTriggerButton,
} from "@dashlane/design-system";
import { AlertSeverity } from "@dashlane/ui-components";
import {
  DropdownType,
  Field,
  ItemType,
  UserCopyVaultItemFieldEvent,
  UserOpenVaultItemDropdownEvent,
} from "@dashlane/hermes";
import { BankAccount } from "@dashlane/vault-contracts";
import { useAlert } from "../../../../libs/alert-notifications/use-alert";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsB2CUserFrozen } from "../../../../libs/frozen-state/hooks/use-is-b2c-user-frozen";
import { logEvent } from "../../../../libs/logs/logEvent";
import { DropdownButton } from "./dropdown-button";
import { LockedItemType, UnlockerAction } from "../../../unlock-items/types";
import { useProtectedItemsUnlocker } from "../../../unlock-items";
import { useActivityLogReport } from "../../../hooks/use-activity-log-report";
import { BankAccountActionsMode, BankAccountValue } from "./types";
import { getLabelsKey } from "./getLabels";
interface DropdownButtonsProps {
  BIC: string;
  IBAN: string;
  bicKey: string;
  ibanKey: string;
  onClick: (value: BankAccountValue) => void;
}
const DropdownButtons = ({
  BIC,
  IBAN,
  bicKey,
  ibanKey,
  onClick,
}: DropdownButtonsProps) => {
  return (
    <>
      <DropdownButton
        onClick={() => onClick(BankAccountValue.BIC)}
        translationKey={bicKey}
        isEnabled={BIC.length > 0}
        value={BankAccountValue.BIC}
      />
      <DropdownButton
        onClick={() => onClick(BankAccountValue.IBAN)}
        translationKey={ibanKey}
        isEnabled={IBAN.length > 0}
        value={BankAccountValue.IBAN}
      />
    </>
  );
};
const I18N_KEYS = {
  LIST_MODE_LABEL: "webapp_payment_bankaccount_list_item_copy_info",
  COPY_TO_CLIPBOARD_ERROR: "webapp_generic_copy_to_clipboard_feedback_error",
};
interface Props {
  bankAccount: Pick<
    BankAccount,
    "id" | "IBAN" | "BIC" | "country" | "accountName" | "spaceId"
  >;
  mode: BankAccountActionsMode;
  dropdownIsOpen: boolean;
  setDropdownIsOpen: (open: boolean) => void;
}
export const BankAccountActions = ({
  bankAccount,
  mode,
  dropdownIsOpen,
  setDropdownIsOpen,
}: Props) => {
  const { translate } = useTranslate();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const alert = useAlert();
  const isUserFrozen = useIsB2CUserFrozen();
  const { logCopiedBankAccountField } = useActivityLogReport();
  const labels = getLabelsKey(bankAccount.country, mode);
  const isSearchMode = mode === BankAccountActionsMode.SEARCH;
  const hasTeamSpaceId = Boolean(bankAccount.spaceId);
  const onClick: MouseEventHandler = (event) => {
    event.stopPropagation();
    if (!dropdownIsOpen) {
      logEvent(
        new UserOpenVaultItemDropdownEvent({
          dropdownType: DropdownType.Copy,
          itemType: ItemType.BankStatement,
        })
      );
    }
    setDropdownIsOpen(!dropdownIsOpen);
  };
  const handleBICCopyClick = async () => {
    logEvent(
      new UserCopyVaultItemFieldEvent({
        itemType: ItemType.BankStatement,
        field: Field.Bic,
        itemId: bankAccount.id,
        isProtected: true,
      })
    );
    if (hasTeamSpaceId) {
      logCopiedBankAccountField({
        name: bankAccount.accountName,
        country: bankAccount.country,
        field: Field.Bic,
      });
    }
    try {
      await navigator.clipboard.writeText(bankAccount.BIC);
      alert.showAlert(translate(labels.BIC_ALERT), AlertSeverity.SUCCESS);
    } catch (err) {}
  };
  const handleIBANCopyClick = async () => {
    logEvent(
      new UserCopyVaultItemFieldEvent({
        itemType: ItemType.BankStatement,
        field: Field.Iban,
        itemId: bankAccount.id,
        isProtected: true,
      })
    );
    if (hasTeamSpaceId) {
      logCopiedBankAccountField({
        name: bankAccount.accountName,
        country: bankAccount.country,
        field: Field.Iban,
      });
    }
    try {
      await navigator.clipboard.writeText(bankAccount.IBAN);
      alert.showAlert(translate(labels.IBAN_ALERT), AlertSeverity.SUCCESS);
    } catch (err) {}
  };
  const handleCopyClick = (valueToCopy: BankAccountValue) => {
    const onItemUnlockedCallback = async () => {
      try {
        switch (valueToCopy) {
          case BankAccountValue.BIC:
            await handleBICCopyClick();
            break;
          case BankAccountValue.IBAN:
            await handleIBANCopyClick();
            break;
        }
      } catch (e) {
        alert.showAlert(
          translate(I18N_KEYS.COPY_TO_CLIPBOARD_ERROR),
          AlertSeverity.ERROR
        );
      }
    };
    if (!areProtectedItemsUnlocked) {
      return openProtectedItemsUnlocker({
        action: UnlockerAction.Copy,
        itemType: LockedItemType.BankAccount,
        successCallback: onItemUnlockedCallback,
      });
    }
    onItemUnlockedCallback();
  };
  const dropdownButtons = (
    <DropdownButtons
      BIC={bankAccount.BIC}
      IBAN={bankAccount.IBAN}
      bicKey={labels.BIC}
      ibanKey={labels.IBAN}
      onClick={handleCopyClick}
    />
  );
  if (isUserFrozen) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownTriggerButton
        showCaret={false}
        icon="ActionCopyOutlined"
        mood={isSearchMode ? "brand" : "neutral"}
        intensity="supershy"
        onClick={onClick}
        layout={isSearchMode ? "iconOnly" : "iconLeading"}
        size={isSearchMode ? "small" : "medium"}
        tooltip={
          isSearchMode ? translate(I18N_KEYS.LIST_MODE_LABEL) : undefined
        }
        aria-label={
          isSearchMode ? translate(I18N_KEYS.LIST_MODE_LABEL) : undefined
        }
      >
        {isSearchMode ? undefined : translate(I18N_KEYS.LIST_MODE_LABEL)}
      </DropdownTriggerButton>
      <DropdownContent>{dropdownButtons}</DropdownContent>
    </DropdownMenu>
  );
};
