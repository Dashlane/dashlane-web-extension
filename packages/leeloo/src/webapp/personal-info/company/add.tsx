import React, { Ref } from 'react';
import { Lee } from 'lee';
import { VaultItemType } from '@dashlane/vault-contracts';
import { CompanyForm, CompanyFormEditableValues, } from 'webapp/personal-info/company/form';
import { getPersonalInfoAddPanel } from 'webapp/personal-info/generic-add';
import { IconType } from 'webapp/personal-info-icon';
const renderCompanyForm = (lee: Lee, ref: Ref<CompanyForm>, signalEditedValues: () => void, currentSpaceId: string): JSX.Element => {
    const data: CompanyFormEditableValues = {
        jobTitle: '',
        companyName: '',
        spaceId: currentSpaceId,
    };
    return (<CompanyForm lee={lee} currentValues={data} signalEditedValues={signalEditedValues} ref={ref}/>);
};
export const CompanyAddPanel = getPersonalInfoAddPanel({
    iconType: IconType.company,
    vaultItemType: VaultItemType.Company,
    renderForm: renderCompanyForm,
});
