import * as React from 'react';
import { Field } from '@dashlane/hermes';
import { VaultItemType } from '@dashlane/vault-contracts';
import { useCredentialData } from 'src/libs/api';
import { DataStatus } from 'src/libs/api/types';
import { CopyDropdownElement } from 'src/app/vault/active-tab-list/lists/common';
const I18N_KEYS = {
    COPY_SECONDARY_LOGIN: 'tab/all_items/credential/view/action/copy_secondary_login',
    SECONDARY_LOGIN_COPIED_TO_CLIPBOARD: 'tab/all_items/credential/actions/secondary_login_copied_to_clipboard',
};
interface SecondaryLoginDropdownElementProps {
    credentialId: string;
}
const SecondaryLoginDropdownElement = ({ credentialId, }: SecondaryLoginDropdownElementProps) => {
    const credentialData = useCredentialData(credentialId);
    if (credentialData.status !== DataStatus.Success ||
        !credentialData.data?.secondaryLogin) {
        return null;
    }
    return (<CopyDropdownElement copyValue={credentialData.data.secondaryLogin} credentialId={credentialId} field={Field.SecondaryLogin} I18N_KEY_text={I18N_KEYS.COPY_SECONDARY_LOGIN} I18N_KEY_notification={I18N_KEYS.SECONDARY_LOGIN_COPIED_TO_CLIPBOARD} itemType={VaultItemType.Credential}/>);
};
export default SecondaryLoginDropdownElement;
