import { Fragment, memo, useState } from "react";
import { Button, DisplayArea, Icon, jsx } from "@dashlane/design-system";
import { CopyIconButton } from "../../../../app/vault/detail-views/credential-detail-view/form-fields/copy-icon-button";
import useProtectedItemsUnlocker from "../../../../app/protected-items-unlocker/useProtectedItemsUnlocker";
import { ConfirmLabelMode } from "../../../../app/protected-items-unlocker/master-password-dialog";
interface ProtectedTextAreaActionsProps {
  revealValueLabel: string;
  hideValueLabel: string;
  copyValueLabel: string;
  onCopyClick: () => void;
  onShowClick?: () => void;
  onHideClick?: () => void;
}
const ProtectedTextAreaActionComponent = ({
  isItemVisible,
  revealValueLabel,
  hideValueLabel,
  copyValueLabel,
  onCopyClick,
  onHideClick,
  onShowClick,
}: ProtectedTextAreaActionsProps & {
  isItemVisible: boolean;
}) => {
  return (
    <>
      {!isItemVisible ? (
        <Button
          aria-label={revealValueLabel}
          tooltip={revealValueLabel}
          icon={<Icon name="ActionRevealOutlined" />}
          intensity="supershy"
          layout="iconOnly"
          onClick={onShowClick}
        />
      ) : (
        <Button
          aria-label={hideValueLabel}
          tooltip={hideValueLabel}
          icon={<Icon name="ActionHideOutlined" />}
          intensity="supershy"
          layout="iconOnly"
          onClick={onHideClick}
        />
      )}
      <CopyIconButton copyAction={onCopyClick} text={copyValueLabel} />
    </>
  );
};
const ProtectedValueActions = memo(ProtectedTextAreaActionComponent);
interface ProtectedTextAreaProps extends ProtectedTextAreaActionsProps {
  value: string;
  valueFieldLabel: string;
  valueFieldId: string;
  protectedItemId: string;
}
const ProtectedTextAreaComponent = ({
  value,
  valueFieldLabel,
  valueFieldId,
  onCopyClick,
  protectedItemId,
  ...actionProps
}: ProtectedTextAreaProps) => {
  const [isItemVisible, setIsItemVisible] = useState(false);
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const executeIfUnlocked = (
    onItemUnlockedCallback: () => void,
    confirmLabelMode: ConfirmLabelMode
  ) => {
    if (!areProtectedItemsUnlocked) {
      return openProtectedItemsUnlocker({
        confirmLabelMode: confirmLabelMode,
        onSuccess: onItemUnlockedCallback,
        onError: () => {},
        onCancel: () => {},
        showNeverAskOption: false,
        credentialId: protectedItemId,
      });
    }
    onItemUnlockedCallback();
  };
  const onShowClick = () => {
    setIsItemVisible(true);
    actionProps.onShowClick?.();
  };
  const onHideClick = () => {
    setIsItemVisible(false);
    actionProps.onHideClick?.();
  };
  return (
    <DisplayArea
      label={valueFieldLabel}
      value={isItemVisible ? value : "••••••••"}
      actions={[
        <ProtectedValueActions
          key="protected-text-area"
          {...actionProps}
          isItemVisible={isItemVisible}
          onShowClick={() =>
            executeIfUnlocked(onShowClick, ConfirmLabelMode.Show)
          }
          onCopyClick={() =>
            executeIfUnlocked(onCopyClick, ConfirmLabelMode.Copy)
          }
          onHideClick={onHideClick}
        />,
      ]}
    />
  );
};
export const ProtectedTextArea = memo(ProtectedTextAreaComponent);
