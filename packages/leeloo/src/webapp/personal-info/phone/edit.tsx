import React, { Ref } from 'react';
import { Country, Phone, VaultItemType } from '@dashlane/vault-contracts';
import { Lee } from 'lee';
import { PhoneForm, PhoneFormEditableValues, } from 'webapp/personal-info/phone/form';
import { getPersonalInfoEditPanel } from 'webapp/personal-info/generic-edit';
import { IconType } from 'webapp/personal-info-icon';
import { TranslateFunction } from 'libs/i18n/types';
import { getPhoneItemName } from 'webapp/personal-info/services';
const I18N_KEYS = {
    DESCRIPTION: 'webapp_personal_info_edition_header_phone_description',
    DELETE_TITLE: 'webapp_personal_info_edition_delete_title_phone',
};
const renderPhoneForm = (lee: Lee, item: Phone, ref: Ref<PhoneForm>, signalEditedValues: () => void): JSX.Element => {
    const country: Country = Country[lee.globalState.locale.country] || Country.US;
    const data: PhoneFormEditableValues = {
        itemName: item.itemName,
        phoneNumber: item.phoneNumber,
        localeFormat: item.localeFormat || country,
        type: item.type,
        spaceId: item.spaceId,
    };
    return (<PhoneForm lee={lee} currentValues={data} signalEditedValues={signalEditedValues} ref={ref}/>);
};
const getDeleteTitle = (translateFn: TranslateFunction) => translateFn(I18N_KEYS.DELETE_TITLE);
const getDescription = (translateFn: TranslateFunction): string => translateFn(I18N_KEYS.DESCRIPTION);
export const PhoneEditPanel = getPersonalInfoEditPanel({
    getDeleteTitle,
    getItemTypeDescription: getDescription,
    getTitle: getPhoneItemName,
    iconType: IconType.phone,
    vaultItemType: VaultItemType.Phone,
    renderForm: renderPhoneForm,
});
