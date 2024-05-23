import { memo, useEffect, useState } from 'react';
import { CredentialPasswordHistoryItemView, PasswordHistoryItemType, PasswordHistoryItemView, } from '@dashlane/communication';
import { Button, colors, CopyIcon, FlexContainer, IncludeIcon, jsx, Tooltip, } from '@dashlane/ui-components';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import errorAction from 'libs/logs/errorActions';
import { SX_STYLES } from 'webapp/list-view/styles';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { LockedItemType, UnlockerAction } from 'webapp/unlock-items/types';
import { PasswordCopyHandlerParams } from '../types';
import styles from '../styles.css';
const I18N_KEYS = {
    COPY_PASSWORD: 'webapp_password_history_quick_action_copy_password_button_tooltip',
    RESTORE_PASSWORD: 'webapp_password_history_quick_action_restore_password_button_tooltip',
};
interface Props {
    item: PasswordHistoryItemView;
    onPasswordCopied: (copyHandlerParams: PasswordCopyHandlerParams) => void;
    onOpenRestorePasswordDialog: (newSelectedItem: CredentialPasswordHistoryItemView) => void;
    isProtected: boolean;
}
const PasswordHistoryRowActionsComponent = ({ item, onPasswordCopied, onOpenRestorePasswordDialog, isProtected, }: Props) => {
    const { translate } = useTranslate();
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const [showRestoreButton, setShowRestoreButton] = useState(false);
    useEffect(() => {
        if (item.type === PasswordHistoryItemType.Credential) {
            const hasLimitedPermissions = async () => {
                const credential = await carbonConnector.getCredential(item.credentialId);
                const limitedPermissions = credential.sharingStatus.isShared &&
                    credential.sharingStatus.permission === 'limited';
                if (limitedPermissions) {
                    setShowRestoreButton(false);
                }
                else {
                    setShowRestoreButton(true);
                }
            };
            hasLimitedPermissions();
        }
        else {
            setShowRestoreButton(false);
        }
    }, [item]);
    const onItemUnlockedCopyPassword = async () => {
        const copySuccess = await navigator.clipboard
            .writeText(item.password)
            .then(() => true)
            .catch((err) => {
            errorAction('[quick-actions-menu]: unable to copy to clipboard', err);
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
    return (<FlexContainer alignItems={'center'} justifyContent={'center'} sx={SX_STYLES.CELLS_WRAPPER}>
      {showRestoreButton ? (<Tooltip content={translate(I18N_KEYS.RESTORE_PASSWORD)} placement="left">
          <Button type="button" name="hiddenAction" nature="ghost" className={styles.restoreButton} onClick={onClickRestore}>
            <IncludeIcon color={colors.dashGreen00}/>
          </Button>
        </Tooltip>) : null}
      <Tooltip content={translate(I18N_KEYS.COPY_PASSWORD)} placement="left">
        <Button type="button" name="hiddenAction" nature="ghost" className={styles.copyButton} onClick={onClickCopy}>
          <CopyIcon color={colors.dashGreen00}/>
        </Button>
      </Tooltip>
    </FlexContainer>);
};
export const PasswordHistoryRowActions = memo(PasswordHistoryRowActionsComponent);
