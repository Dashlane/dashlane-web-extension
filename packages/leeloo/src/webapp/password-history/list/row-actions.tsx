import { memo, useEffect, useState } from "react";
import {
  CredentialPasswordHistoryItemView,
  PasswordHistoryItemType,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import { Permission } from "@dashlane/sharing-contracts";
import { Button, Flex, mergeSx } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import errorAction from "../../../libs/logs/errorActions";
import { SX_STYLES } from "../../list-view/styles";
import { useProtectedItemsUnlocker } from "../../unlock-items";
import { LockedItemType, UnlockerAction } from "../../unlock-items/types";
import { PasswordCopyHandlerParams } from "../types";
const I18N_KEYS = {
  COPY_PASSWORD:
    "webapp_password_history_quick_action_copy_password_button_tooltip",
  RESTORE_PASSWORD:
    "webapp_password_history_quick_action_restore_password_button_tooltip",
};
interface Props {
  item: PasswordHistoryItemView;
  onPasswordCopied: (copyHandlerParams: PasswordCopyHandlerParams) => void;
  onOpenRestorePasswordDialog: (
    newSelectedItem: CredentialPasswordHistoryItemView
  ) => void;
  isProtected: boolean;
  sharingStatus: {
    isShared: boolean;
    permission?: Permission;
  };
}
const PasswordHistoryRowActionsComponent = ({
  item,
  onPasswordCopied,
  onOpenRestorePasswordDialog,
  isProtected,
  sharingStatus,
}: Props) => {
  const { translate } = useTranslate();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const [showRestoreButton, setShowRestoreButton] = useState(false);
  useEffect(() => {
    if (item.type === PasswordHistoryItemType.Credential) {
      const hasLimitedPermissions = () => {
        const limitedPermissions =
          sharingStatus.isShared &&
          sharingStatus.permission === Permission.Limited;
        if (limitedPermissions) {
          setShowRestoreButton(false);
        } else {
          setShowRestoreButton(true);
        }
      };
      hasLimitedPermissions();
    } else {
      setShowRestoreButton(false);
    }
  }, [item]);
  const onItemUnlockedCopyPassword = async () => {
    const copySuccess = await navigator.clipboard
      .writeText(item.password)
      .then(() => true)
      .catch((err) => {
        errorAction("[quick-actions-menu]: unable to copy to clipboard", err);
        return false;
      });
    onPasswordCopied({
      success: copySuccess,
      isProtected,
      itemId: item.id,
    });
  };
  const onClickCopy = () => {
    if (isProtected && !areProtectedItemsUnlocked) {
      return openProtectedItemsUnlocker({
        action: UnlockerAction.Copy,
        itemType: LockedItemType.GeneratedPassword,
        successCallback: onItemUnlockedCopyPassword,
      });
    }
    onItemUnlockedCopyPassword();
  };
  const onClickRestore = () => {
    onOpenRestorePasswordDialog(item as CredentialPasswordHistoryItemView);
  };
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      sx={mergeSx([SX_STYLES.CELLS_WRAPPER, { gap: "8px" }])}
    >
      {showRestoreButton ? (
        <Button
          data-testid="ph-row-restore-btn"
          onClick={onClickRestore}
          layout="iconOnly"
          icon="ActionUndoOutlined"
          mood="brand"
          intensity="supershy"
          tooltip={translate(I18N_KEYS.RESTORE_PASSWORD)}
        />
      ) : null}

      <Button
        data-testid="ph-row-copy-btn"
        layout="iconOnly"
        icon="ActionCopyOutlined"
        onClick={onClickCopy}
        mood="brand"
        intensity="supershy"
        tooltip={translate(I18N_KEYS.COPY_PASSWORD)}
      />
    </Flex>
  );
};
export const PasswordHistoryRowActions = memo(
  PasswordHistoryRowActionsComponent
);
