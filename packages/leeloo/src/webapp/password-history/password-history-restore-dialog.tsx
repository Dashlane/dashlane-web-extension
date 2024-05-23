import React from 'react';
import { CredentialPasswordHistoryItemView } from '@dashlane/communication';
import { Button, FlexContainer, Paragraph } from '@dashlane/ui-components';
import { useProtectPasswordsSetting } from 'libs/carbon/hooks/useProtectPasswordsSetting';
import { carbonConnector } from 'libs/carbon/connector';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import useTranslate from 'libs/i18n/useTranslate';
import { LockedItemType, UnlockerAction } from 'webapp/unlock-items/types';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items/useProtectedItemsUnlocker';
import { isItemPasswordProtected } from './list/helpers';
const I18N_KEYS = {
    DIALOG_RESTORE_TITLE: 'webapp_password_history_quick_action_restore_password_dialog_title',
    DIALOG_RESTORE_OK: 'webapp_password_history_quick_action_restore_password_dialog_button_ok',
    DIALOG_RESTORE_CANCEL: 'webapp_password_history_quick_action_restore_password_dialog_button_cancel',
    DIALOG_RESTORE_DESCRIPTION: 'webapp_password_history_quick_action_restore_password_dialog_content',
};
interface Props {
    item: CredentialPasswordHistoryItemView;
    isOpen: boolean;
    onCloseRestorePasswordDialog: () => void;
    onPasswordRestored: (item: CredentialPasswordHistoryItemView, success: boolean) => void;
}
export const RestorePasswordDialog = ({ item, isOpen, onCloseRestorePasswordDialog, onPasswordRestored, }: Props) => {
    const { translate } = useTranslate();
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const mpSettingsResponse = useProtectPasswordsSetting();
    const isProtected = isItemPasswordProtected(item, mpSettingsResponse);
    const onItemUnlockedRestorePassword = () => {
        carbonConnector
            .updateCredential({
            id: item.credentialId,
            update: {
                password: item.password,
            },
        })
            .then((value) => onPasswordRestored(item, value.success));
    };
    const onClickOk = () => {
        onCloseRestorePasswordDialog();
        if (isProtected && !areProtectedItemsUnlocked) {
            return openProtectedItemsUnlocker({
                action: UnlockerAction.Copy,
                itemType: LockedItemType.GeneratedPassword,
                successCallback: onItemUnlockedRestorePassword,
            });
        }
        onItemUnlockedRestorePassword();
    };
    return (<SimpleDialog showCloseIcon title={translate(I18N_KEYS.DIALOG_RESTORE_TITLE)} isOpen={isOpen} onRequestClose={onCloseRestorePasswordDialog} footer={<FlexContainer justifyContent="end" gap="8px">
          <Button type="button" nature="secondary" onClick={onClickOk}>
            {translate(I18N_KEYS.DIALOG_RESTORE_OK)}
          </Button>
          <Button type="button" onClick={onCloseRestorePasswordDialog}>
            {translate(I18N_KEYS.DIALOG_RESTORE_CANCEL)}
          </Button>
        </FlexContainer>}>
      <FlexContainer flexDirection="column" gap="8px" sx={{ width: '576px' }}>
        <Paragraph>
          {translate(I18N_KEYS.DIALOG_RESTORE_DESCRIPTION, {
            domain: item.primaryInfo,
        })}
        </Paragraph>
      </FlexContainer>
    </SimpleDialog>);
};
