import React, { MouseEventHandler } from 'react';
import { DropdownElement } from '@dashlane/ui-components';
import { Field } from '@dashlane/hermes';
import { VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'src/libs/i18n/useTranslate';
import { useOnCopyAction } from './useOnCopyAction';
export interface CopyDropdownElementProps {
    copyValue: string;
    credentialId: string;
    field: Field;
    itemType: VaultItemType;
    I18N_KEY_text: string;
    I18N_KEY_notification: string;
}
const CopyDropdownElement = ({ copyValue, credentialId, field, itemType, I18N_KEY_text, I18N_KEY_notification, }: CopyDropdownElementProps) => {
    const { translate } = useTranslate();
    const onCopyAction = useOnCopyAction();
    const copy: MouseEventHandler = () => {
        void onCopyAction(copyValue, credentialId, field, itemType, translate(I18N_KEY_notification));
    };
    return (<DropdownElement fullWidth onClick={copy}>
      {translate(I18N_KEY_text)}
    </DropdownElement>);
};
export default CopyDropdownElement;
