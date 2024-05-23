import React, { useRef } from 'react';
import { Field } from '@dashlane/hermes';
import { useModuleQuery } from '@dashlane/framework-react';
import { Credential, vaultItemsCrudApi } from '@dashlane/vault-contracts';
import { AlertSeverity } from '@dashlane/ui-components';
import { useAlert } from 'libs/alert-notifications/use-alert';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'libs/carbon/connector';
import { sendLogsForCopyVaultItem } from '../helpers';
import { Menu } from './menu';
interface Props {
    closePopover?: () => void;
    credential: Credential;
    onCopyLogin: () => void;
    onCopyEmail: () => void;
    onEditItem: () => void;
    onGoToWebsite?: () => void;
}
const I18N_KEYS = {
    COPY_ERROR_ALERT: 'webapp_generic_copy_to_clipboard_feedback_error',
};
export const QuickActionsMenuContent = ({ closePopover, credential, onCopyEmail, onCopyLogin, onEditItem, onGoToWebsite, }: Props) => {
    const { translate } = useTranslate();
    const copyErrorAlert = useAlert();
    const credentialsGloballyRequireMPRef = useRef<boolean>();
    const { data } = useModuleQuery(vaultItemsCrudApi, 'tempCredentialPreferences', {
        credentialId: credential.id,
    });
    React.useEffect(() => {
        carbonConnector.arePasswordsProtected().then((protectPasswords) => {
            credentialsGloballyRequireMPRef.current = protectPasswords;
        });
    }, []);
    const requireMasterPassword = Boolean(data?.requireMasterPassword);
    const onCopyPassword = () => {
        const isProtected = requireMasterPassword || !!credentialsGloballyRequireMPRef.current;
        sendLogsForCopyVaultItem(credential.id, credential.URL, Field.Password, isProtected);
    };
    const onCopyHandler = (onCopyFunction: () => void, success: boolean) => {
        onCopyFunction();
        if (!success) {
            copyErrorAlert.showAlert(translate(I18N_KEYS.COPY_ERROR_ALERT), AlertSeverity.ERROR);
        }
    };
    return (<Menu autoProtected={requireMasterPassword} closePopover={closePopover} id={credential.id} login={credential.username} email={credential.email} onCopyLogin={(success) => onCopyHandler(onCopyLogin, success)} onCopyPassword={(success) => onCopyHandler(onCopyPassword, success)} onCopyEmail={(success) => onCopyHandler(onCopyEmail, success)} onEditItem={onEditItem} onGoToWebsite={onGoToWebsite} password={credential.password} spaceId={credential.spaceId} title={credential.itemName}/>);
};
