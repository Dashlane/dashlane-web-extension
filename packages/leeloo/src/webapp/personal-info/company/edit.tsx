import React, { Ref } from 'react';
import { Company, VaultItemType } from '@dashlane/vault-contracts';
import { Lee } from 'lee';
import { CompanyForm, CompanyFormEditableValues, } from 'webapp/personal-info/company/form';
import { getPersonalInfoEditPanel } from 'webapp/personal-info/generic-edit';
import { IconType } from 'webapp/personal-info-icon';
import { TranslateFunction } from 'libs/i18n/types';
const I18N_KEYS = {
    DESCRIPTION: 'webapp_personal_info_edition_header_company_description',
    DELETE_TITLE: 'webapp_personal_info_edition_delete_title_company',
};
const renderCompanyForm = (lee: Lee, item: Company, ref: Ref<CompanyForm>, signalEditedValues: () => void): JSX.Element => {
    const data: CompanyFormEditableValues = {
        jobTitle: item.jobTitle,
        companyName: item.companyName,
        spaceId: item.spaceId,
    };
    return (<CompanyForm lee={lee} currentValues={data} signalEditedValues={signalEditedValues} ref={ref}/>);
};
const getTitle = (item: Company): string => item.companyName;
const getDeleteTitle = (translateFn: TranslateFunction): string => translateFn(I18N_KEYS.DELETE_TITLE);
const getDescription = (translateFn: TranslateFunction): string => translateFn(I18N_KEYS.DESCRIPTION);
export const CompanyEditPanel = getPersonalInfoEditPanel({
    getDeleteTitle,
    getItemTypeDescription: getDescription,
    getTitle,
    iconType: IconType.company,
    vaultItemType: VaultItemType.Company,
    renderForm: renderCompanyForm,
});
