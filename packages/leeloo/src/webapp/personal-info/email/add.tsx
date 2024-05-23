import React, { Ref } from 'react';
import { Lee } from 'lee';
import { EmailType, VaultItemType } from '@dashlane/vault-contracts';
import { EmailForm, EmailFormEditableValues, } from 'webapp/personal-info/email/form';
import { getPersonalInfoAddPanel } from 'webapp/personal-info/generic-add';
import { IconType } from 'webapp/personal-info-icon';
const renderEmailForm = (lee: Lee, ref: Ref<EmailForm>, signalEditedValues: () => void, currentSpaceId: string): JSX.Element => {
    const data: EmailFormEditableValues = {
        emailAddress: '',
        itemName: '',
        spaceId: currentSpaceId,
        type: EmailType.Perso,
    };
    return (<EmailForm lee={lee} currentValues={data} signalEditedValues={signalEditedValues} ref={ref}/>);
};
export const EmailAddPanel = getPersonalInfoAddPanel({
    iconType: IconType.email,
    vaultItemType: VaultItemType.Email,
    renderForm: renderEmailForm,
});
