import React, { Ref } from 'react';
import { Email, VaultItemType } from '@dashlane/vault-contracts';
import { Lee } from 'lee';
import { EmailForm, EmailFormEditableValues, } from 'webapp/personal-info/email/form';
import { getPersonalInfoEditPanel } from 'webapp/personal-info/generic-edit';
import { IconType } from 'webapp/personal-info-icon';
import { TranslateFunction } from 'libs/i18n/types';
const I18N_KEYS = {
    DESCRIPTION: 'webapp_personal_info_edition_header_email_description',
    DELETE_TITLE: 'webapp_personal_info_edition_delete_title_email',
};
const renderEmailForm = (lee: Lee, item: Email, ref: Ref<EmailForm>, signalEditedValues: () => void): JSX.Element => {
    const data: EmailFormEditableValues = {
        type: item.type,
        itemName: item.itemName,
        emailAddress: item.emailAddress,
        spaceId: item.spaceId || '',
    };
    return (<EmailForm lee={lee} currentValues={data} signalEditedValues={signalEditedValues} ref={ref}/>);
};
const getTitle = (item: Email): string => item.itemName;
const getDeleteTitle = (translateFn: TranslateFunction) => translateFn(I18N_KEYS.DELETE_TITLE);
const getDescription = (translateFn: TranslateFunction): string => translateFn(I18N_KEYS.DESCRIPTION);
export const EmailEditPanel = getPersonalInfoEditPanel({
    getDeleteTitle,
    getItemTypeDescription: getDescription,
    getTitle,
    iconType: IconType.email,
    vaultItemType: VaultItemType.Email,
    renderForm: renderEmailForm,
});
