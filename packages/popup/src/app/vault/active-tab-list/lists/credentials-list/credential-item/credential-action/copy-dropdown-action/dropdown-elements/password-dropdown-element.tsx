import React from 'react';
import { Field } from '@dashlane/hermes';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { Credential, VaultItemType } from '@dashlane/vault-contracts';
import { Permission, sharingItemsApi } from '@dashlane/sharing-contracts';
import { ConfirmLabelMode } from 'src/app/protected-items-unlocker/master-password-dialog';
import { useCredentialPasswordIsProtected } from 'src/libs/credentials/useCredentialPasswordIsProtected';
import useTranslate from 'src/libs/i18n/useTranslate';
import { CopyDropdownElement, ProtectedCopyDropdownElement, } from 'src/app/vault/active-tab-list/lists/common';
import { DisabledDropdownElement } from './disabled-dropdown-element';
const I18N_KEYS = {
    COPY_PASSWORD: 'tab/all_items/credential/actions/copy_password',
    LIMITED_ACCESS: 'tab/all_items/credential/actions/copy_protected_password',
    NO_PASSWORD: 'tab/all_items/credential/actions/no_password',
    PASSWORD_COPIED_TO_CLIPBOARD: 'tab/all_items/credential/actions/password_copied_to_clipboard',
};
interface PasswordDropdownElementProps {
    credential: Credential;
}
const PasswordDropdownElement = ({ credential, }: PasswordDropdownElementProps) => {
    const { translate } = useTranslate();
    const isProtected = useCredentialPasswordIsProtected(credential.id);
    const { data, status } = useModuleQuery(sharingItemsApi, 'getPermissionForItem', {
        itemId: credential.id,
    });
    if (isProtected === null || status !== DataStatus.Success) {
        return null;
    }
    const hasSharedLimitedPermission = data.permission === Permission.Limited;
    if (hasSharedLimitedPermission || !credential.password) {
        return (<DisabledDropdownElement dropdownLabel={translate(I18N_KEYS.COPY_PASSWORD)} tooltipTitle={translate(hasSharedLimitedPermission
                ? I18N_KEYS.LIMITED_ACCESS
                : I18N_KEYS.NO_PASSWORD)}/>);
    }
    const defaultCopyDropdownProps = {
        copyValue: credential.password,
        credentialId: credential.id,
        field: Field.Password,
        I18N_KEY_text: I18N_KEYS.COPY_PASSWORD,
        I18N_KEY_notification: I18N_KEYS.PASSWORD_COPIED_TO_CLIPBOARD,
        itemType: VaultItemType.Credential,
    };
    return isProtected ? (<ProtectedCopyDropdownElement {...defaultCopyDropdownProps} confirmLabelMode={ConfirmLabelMode.CopyPassword} credentialUrl={credential.URL}/>) : (<CopyDropdownElement {...defaultCopyDropdownProps}/>);
};
export default PasswordDropdownElement;
