import { memo, useState } from "react";
import {
  Field,
  ItemType,
  UserRevealVaultItemFieldEvent,
} from "@dashlane/hermes";
import { jsx, ObfuscatedDisplayField } from "@dashlane/design-system";
import { CopyIconButton } from "../../../../app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button";
import useProtectedItemsUnlocker from "../../../../app/protected-items-unlocker/useProtectedItemsUnlocker";
import { ConfirmLabelMode } from "../../../../app/protected-items-unlocker/master-password-dialog";
import { logEvent } from "../../../../libs/logs/logEvent";
interface ProtectedValueFieldActionsProps {
  isItemVisible: boolean;
  isItemProtected?: boolean;
  showNeverAskOption?: boolean;
  shouldItemBeVisible?: boolean;
  isCopyDisabled?: boolean;
  revealValueLabel: string;
  hideValueLabel: string;
  copyValueLabel: string;
  onCopyClick: () => void;
  onShowClick?: () => void;
  onHideClick?: () => void;
}
const FIELD_LOGS = {
  password: Field.Password,
  cardNumber: Field.CardNumber,
  securityCode: Field.SecurityCode,
  IBAN: Field.Iban,
  BIC: Field.Bic,
};
interface ProtectedValueFieldProps
  extends Omit<ProtectedValueFieldActionsProps, "isItemVisible"> {
  value: string;
  valueFieldLabel: string;
  valueFieldId: string;
  protectedItemId: string;
  fieldType: ItemType;
}
const getFieldObfuscatedValue = (fieldId: string) => {
  switch (fieldId) {
    case "password":
      return "••••••••••••";
    case "cardNumber":
      return "•••• •••• •••• ••••";
    case "securityCode":
      return "•••";
    case "BIC":
      return "••••••••";
    case "IBAN":
      return "••••••••••••••••";
    default:
      return "••••";
  }
};
const ProtectedValueFieldComponent = ({
  value,
  valueFieldLabel,
  valueFieldId,
  revealValueLabel,
  hideValueLabel,
  copyValueLabel,
  onCopyClick,
  protectedItemId,
  fieldType,
  showNeverAskOption = false,
  isItemProtected = true,
  shouldItemBeVisible = false,
  isCopyDisabled = false,
  ...actionProps
}: ProtectedValueFieldProps) => {
  const [isItemVisible, setIsItemVisible] = useState(false);
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const toggleShowProtectedField = (): Promise<void> => {
    const onItemUnlocked = () => {
      void logEvent(
        new UserRevealVaultItemFieldEvent({
          field: FIELD_LOGS[valueFieldId as keyof typeof FIELD_LOGS],
          isProtected: true,
          itemId: protectedItemId,
          itemType: fieldType,
        })
      );
      actionProps.onShowClick?.();
    };
    if (!areProtectedItemsUnlocked && isItemProtected) {
      return new Promise<void>((resolve, reject) => {
        openProtectedItemsUnlocker({
          confirmLabelMode: ConfirmLabelMode.Show,
          onSuccess: () => {
            onItemUnlocked();
            setIsItemVisible(!isItemVisible);
            return resolve();
          },
          onCancel: () => reject(new Error()),
          showNeverAskOption: showNeverAskOption,
          credentialId: protectedItemId,
        });
      });
    } else {
      setIsItemVisible(!isItemVisible);
      return Promise.resolve();
    }
  };
  const executeIfUnlocked = (
    onItemUnlockedCallback: () => void,
    confirmLabelMode: ConfirmLabelMode
  ) => {
    const onItemUnlocked = () => {
      void logEvent(
        new UserRevealVaultItemFieldEvent({
          field: FIELD_LOGS[valueFieldId as keyof typeof FIELD_LOGS],
          isProtected: true,
          itemId: protectedItemId,
          itemType: fieldType,
        })
      );
      onItemUnlockedCallback();
    };
    if (!areProtectedItemsUnlocked && isItemProtected) {
      return openProtectedItemsUnlocker({
        confirmLabelMode: confirmLabelMode,
        onSuccess: onItemUnlocked,
        onError: () => {},
        onCancel: () => {},
        showNeverAskOption: showNeverAskOption,
        credentialId: protectedItemId,
      });
    }
    void logEvent(
      new UserRevealVaultItemFieldEvent({
        field: FIELD_LOGS[valueFieldId as keyof typeof FIELD_LOGS],
        isProtected: true,
        itemId: protectedItemId,
        itemType: fieldType,
      })
    );
    onItemUnlockedCallback();
  };
  return (
    <ObfuscatedDisplayField
      onCopy={isCopyDisabled ? (e) => e.preventDefault() : undefined}
      toggleVisibilityLabel={
        shouldItemBeVisible
          ? {
              hide: hideValueLabel,
              show: revealValueLabel,
            }
          : undefined
      }
      label={valueFieldLabel}
      value={
        isItemVisible && shouldItemBeVisible
          ? value
          : getFieldObfuscatedValue(valueFieldId)
      }
      data-name={valueFieldId}
      onValueVisibilityChangeRequest={toggleShowProtectedField}
      actions={
        shouldItemBeVisible
          ? [
              <CopyIconButton
                key="copy"
                copyAction={() =>
                  executeIfUnlocked(onCopyClick, ConfirmLabelMode.Copy)
                }
                text={copyValueLabel}
              />,
            ]
          : undefined
      }
    />
  );
};
export const ProtectedValueField = memo(ProtectedValueFieldComponent);
