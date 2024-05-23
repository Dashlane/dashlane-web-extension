import React, { Ref } from 'react';
import { format as dateFormatter } from 'date-fns';
import { Identity, VaultItemType } from '@dashlane/vault-contracts';
import { Lee } from 'lee';
import { IdentityForm, IdentityFormEditableValues, } from 'webapp/personal-info/identity/form';
import { getPersonalInfoEditPanel } from 'webapp/personal-info/generic-edit';
import { IconType } from 'webapp/personal-info-icon';
import { TranslateFunction } from 'libs/i18n/types';
import { getIdentityItemFullName, parseDate, } from 'webapp/personal-info/services';
const I18N_KEYS = {
    DESCRIPTION: 'webapp_personal_info_edition_header_identity_description',
    DELETE_TITLE: 'webapp_personal_info_edition_delete_title_name',
};
const renderIdentityForm = (lee: Lee, item: Identity, ref: Ref<IdentityForm>, signalEditedValues: () => void): JSX.Element => {
    const dateArg = parseDate(item.birthDate);
    const birthDate = dateFormatter(dateArg, 'yyyy-MM-dd');
    const data: IdentityFormEditableValues = {
        ...item,
        birthDate,
    };
    return (<IdentityForm lee={lee} currentValues={data} signalEditedValues={signalEditedValues} ref={ref}/>);
};
const getTitle = (item: Identity): string => getIdentityItemFullName(item) || '';
const getDeleteTitle = (translateFn: TranslateFunction) => translateFn(I18N_KEYS.DELETE_TITLE);
const getDescription = (translateFn: TranslateFunction): string => translateFn(I18N_KEYS.DESCRIPTION);
export const IdentityEditPanel = getPersonalInfoEditPanel({
    getDeleteTitle,
    getItemTypeDescription: getDescription,
    getTitle,
    iconType: IconType.identity,
    vaultItemType: VaultItemType.Identity,
    renderForm: renderIdentityForm,
});
