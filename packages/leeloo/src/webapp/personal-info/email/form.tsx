import React from 'react';
import { find, head, propEq } from 'ramda';
import { Email, EmailType } from '@dashlane/vault-contracts';
import DetailField from 'libs/dashlane-style/detail-field';
import DetailSelect, { Option as DetailSelectOption, } from 'libs/dashlane-style/select-field/detail';
import { TrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import GenericForm, { isEmail } from 'webapp/personal-data/edit/form/common';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
interface EmailTypeOption extends DetailSelectOption {
    value: EmailType;
}
export type EmailFormEditableValues = Pick<Email, 'emailAddress' | 'itemName' | 'spaceId' | 'type'>;
export class EmailForm extends GenericForm<EmailFormEditableValues> {
    static contextType = TrialDiscontinuedDialogContext;
    public isFormValid(): boolean {
        return this.validateValues({
            emailAddress: isEmail,
        });
    }
    public render() {
        const _ = this.props.lee.translate.namespace('webapp_personal_info_edition_email_');
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        const emailTypeOptions: EmailTypeOption[] = [
            {
                label: _('perso_type'),
                value: EmailType.Perso,
            },
            {
                label: _('pro_type'),
                value: EmailType.Pro,
            },
        ];
        const currentTypeOption: EmailTypeOption = find<EmailTypeOption>(propEq('value', this.state.values.type), emailTypeOptions) ?? head(emailTypeOptions);
        return (<>
        <DetailField type="email" label={_('email_label')} placeholder={_('placeholder_no_email')} dataName="emailAddress" value={this.state.values.emailAddress} error={this.state.errors.emailAddress} onChange={this.handleChange} disabled={!!isDisabled}/>

        <DetailSelect label={_('type_label')} placeholder={currentTypeOption.label} dataName="type" options={emailTypeOptions} defaultOption={currentTypeOption} onChange={this.handleChange} disabled={!!isDisabled}/>

        <DetailField label={_('name_label')} placeholder={_('placeholder_no_emailName')} dataName="itemName" value={this.state.values.itemName} onChange={this.handleChange} disabled={!!isDisabled}/>

        <SpaceSelect labelSx={spaceSelectFormLabelSx} spaceId={this.state.values.spaceId ?? ''} onChange={(newSpaceId) => this.handleChange(newSpaceId, 'spaceId')} disabled={!!isDisabled}/>
      </>);
    }
}
