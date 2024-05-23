import React from 'react';
import { useToast } from '@dashlane/design-system';
import { AnonymousCopyVaultItemFieldEvent, DomainType, Field, hashDomain, ItemType, UserCopyVaultItemFieldEvent, } from '@dashlane/hermes';
import { ParsedURL } from '@dashlane/url-parser';
import { Credential, VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'src/libs/i18n/useTranslate';
import { logEvent } from 'src/libs/logs/logEvent';
import { sendLogsForRevealPassword } from 'src/app/vault/detail-views/helpers';
import useProtectedItemsUnlocker from 'src/app/protected-items-unlocker/useProtectedItemsUnlocker';
import PasswordInput from 'src/components/inputs/common/password-input/password-input';
import { useCredentialPasswordStatus } from 'libs/credentials/useCredentialPasswordStatus';
import { PasswordActions } from 'src/app/vault/detail-views/credential-detail-view/form-fields/password-actions';
import { PasswordStatus } from 'src/libs/credentials/types';
import { ConfirmLabelMode } from 'src/app/protected-items-unlocker/master-password-dialog';
import { useCredentialPasswordIsProtected } from 'src/libs/credentials/useCredentialPasswordIsProtected';
import { useAlertAutofillEngine } from 'src/app/use-autofill-engine';
import Input from 'src/components/inputs/common/input/input';
export const I18N_KEYS = {
    LABEL: 'tab/all_items/credential/view/label/password',
    PASSWORD_COPIED: 'tab/all_items/credential/actions/password_copied_to_clipboard',
};
interface PasswordFieldProps {
    credential: Credential;
}
const sendLogsForCopyVaultItem = async (id: string, URL: string, isProtected: boolean) => {
    void logEvent(new UserCopyVaultItemFieldEvent({
        itemType: ItemType.Credential,
        field: Field.Password,
        itemId: id,
        isProtected: isProtected,
    }));
    const rootDomain = new ParsedURL(URL).getRootDomain();
    void logEvent(new AnonymousCopyVaultItemFieldEvent({
        itemType: ItemType.Credential,
        field: Field.Password,
        domain: {
            id: await hashDomain(rootDomain),
            type: DomainType.Web,
        },
    }));
};
const PasswordFieldComponent: React.FC<PasswordFieldProps> = ({ credential, }) => {
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const alertAutofillEngine = useAlertAutofillEngine();
    const [isPasswordVisible, setPasswordVisible] = React.useState(false);
    const { openProtectedItemsUnlocker, areProtectedItemsUnlocked } = useProtectedItemsUnlocker();
    const passwordStatus = useCredentialPasswordStatus(credential.id, {
        areProtectedItemsUnlocked,
    });
    const isProtected = useCredentialPasswordIsProtected(credential.id);
    const handleShowPasswordClick = React.useCallback(() => {
        switch (passwordStatus) {
            case PasswordStatus.Unknown:
                break;
            case PasswordStatus.Limited:
                break;
            case PasswordStatus.Protected:
                openProtectedItemsUnlocker({
                    confirmLabelMode: ConfirmLabelMode.ShowPassword,
                    onSuccess: () => {
                        void sendLogsForRevealPassword(credential.id, credential.URL, isProtected ?? false);
                        setPasswordVisible(true);
                    },
                    showNeverAskOption: true,
                    credentialId: credential.id,
                });
                break;
            case PasswordStatus.Unlocked:
                void sendLogsForRevealPassword(credential.id, credential.URL, isProtected ?? false);
                setPasswordVisible(true);
        }
    }, [openProtectedItemsUnlocker, passwordStatus, credential, isProtected]);
    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(credential.password);
        await sendLogsForCopyVaultItem(credential.id, credential.URL, isProtected ?? true);
        showToast({
            description: translate(I18N_KEYS.PASSWORD_COPIED),
        });
    };
    const handleCopyPasswordClick = React.useCallback(async () => {
        switch (passwordStatus) {
            case PasswordStatus.Unknown:
                break;
            case PasswordStatus.Limited:
                break;
            case PasswordStatus.Protected:
                openProtectedItemsUnlocker({
                    confirmLabelMode: ConfirmLabelMode.CopyPassword,
                    onSuccess: () => {
                        void copyToClipboard();
                    },
                    showNeverAskOption: true,
                    credentialId: credential.id,
                });
                break;
            case PasswordStatus.Unlocked:
                await copyToClipboard();
                await alertAutofillEngine(credential.id, credential.password, VaultItemType.Credential, Field.Password);
        }
    }, [
        credential.id,
        credential.password,
        credential.URL,
        openProtectedItemsUnlocker,
        passwordStatus,
        isProtected,
    ]);
    const passwordActions = (<PasswordActions credentialId={credential.id} isPasswordVisible={isPasswordVisible} onCopyClick={() => {
            void handleCopyPasswordClick();
        }} onHideClick={() => setPasswordVisible(false)} onShowClick={handleShowPasswordClick}/>);
    return !isPasswordVisible ? (<Input id={'password'} label={translate(I18N_KEYS.LABEL)} value={'••••••••••••'} inputType={'password'} actions={passwordActions} readonly={true}/>) : (<PasswordInput id={'password'} label={translate(I18N_KEYS.LABEL)} value={credential.password} actions={passwordActions}/>);
};
export const PasswordField = React.memo(PasswordFieldComponent);
