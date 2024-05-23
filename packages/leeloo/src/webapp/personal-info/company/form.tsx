import React from 'react';
import { Company } from '@dashlane/vault-contracts';
import DetailField from 'libs/dashlane-style/detail-field';
import { TrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import GenericForm, { isNotEmpty } from 'webapp/personal-data/edit/form/common';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
export type CompanyFormEditableValues = Pick<Company, 'companyName' | 'jobTitle' | 'spaceId'>;
export class CompanyForm extends GenericForm<CompanyFormEditableValues> {
    static contextType = TrialDiscontinuedDialogContext;
    public isFormValid(): boolean {
        return this.validateValues({
            companyName: isNotEmpty,
        });
    }
    public render() {
        const _ = this.props.lee.translate.namespace('webapp_personal_info_edition_company_');
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        return (<>
        <DetailField label={_('name_label')} placeholder={_('placeholder_no_name')} dataName="companyName" value={this.state.values.companyName} error={this.state.errors.companyName} onChange={this.handleChange} disabled={!!isDisabled}/>

        <DetailField label={_('jobTitle_label')} placeholder={_('placeholder_no_jobTitle')} dataName="jobTitle" value={this.state.values.jobTitle} onChange={this.handleChange} disabled={!!isDisabled}/>

        <SpaceSelect labelSx={spaceSelectFormLabelSx} spaceId={this.state.values.spaceId ?? ''} onChange={(newSpaceId) => this.handleChange(newSpaceId, 'spaceId')} disabled={!!isDisabled}/>
      </>);
    }
}
