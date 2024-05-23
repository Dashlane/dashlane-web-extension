import React from 'react';
import { uniqBy } from 'ramda';
import { format as dateFormatter, parseISO } from 'date-fns';
import { Identity, IdentityTitle } from '@dashlane/vault-contracts';
import GenericForm, { isNotEmpty } from 'webapp/personal-data/edit/form/common';
import DetailField from 'libs/dashlane-style/detail-field';
import DetailSelect, { Option as DetailSelectOption, } from 'libs/dashlane-style/select-field/detail';
import { DateFieldSelect } from 'libs/dashlane-style/date-field/select';
import { TrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { LocaleFormat } from 'libs/i18n/helpers';
import styles from 'webapp/personal-data/edit/form/styles.css';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
import { Field, isFieldVisible } from './settings';
const I18NKEYS = {
    TITLE_LABEL: 'webapp_personal_info_edition_identity_title_label',
    FIELD_REQUIRED: 'webapp_personal_info_edition_identity_error',
    FIRSTNAME: 'webapp_personal_info_edition_identity_firstname_label',
    FIRSTNAME_PLACEHOLDER: 'webapp_personal_info_edition_identity_placeholder_no_firstname',
    MIDDLENAME: 'webapp_personal_info_edition_identity_middlename_label',
    MIDDLENAME_PLACEHOLDER: 'webapp_personal_info_edition_identity_placeholder_no_middlename',
    LASTNAME: 'webapp_personal_info_edition_identity_lastname_label',
    LASTNAME_PLACEHOLDER: 'webapp_personal_info_edition_identity_placeholder_no_lastname',
    LASTNAME2: 'webapp_personal_info_edition_identity_lastname2_label',
    LASTNAME2_PLACEHOLDER: 'webapp_personal_info_edition_identity_placeholder_no_lastname2',
    PSEUDO: 'webapp_personal_info_edition_identity_pseudo_label',
    PSEUDO_PLACEHOLDER: 'webapp_personal_info_edition_identity_placeholder_no_pseudo',
    BIRTHDATE: 'webapp_personal_info_edition_identity_birthdate_label',
    BIRTHPLACE: 'webapp_personal_info_edition_identity_birthplace_label',
    BIRTHPLACE_PLACEHOLDER: 'webapp_personal_info_edition_identity_placeholder_no_birthplace',
    MR: 'webapp_personal_info_edition_identity_title_mr',
    MME: 'webapp_personal_info_edition_identity_title_mrs',
    MLLE: 'webapp_personal_info_edition_identity_title_miss',
    MS: 'webapp_personal_info_edition_identity_title_ms',
    MX: 'webapp_personal_info_edition_identity_title_mx',
    NONE_OF_THESE: 'webapp_personal_info_edition_identity_title_none_of_these',
};
const DATE_FIELD_FORMAT = 'yyyy-MM-dd';
interface IdentityTitleOption extends DetailSelectOption {
    value: IdentityTitle;
}
export type IdentityFormEditableValues = Omit<Identity, 'anonId' | 'id' | 'lastBackupTime'>;
export class IdentityForm extends GenericForm<IdentityFormEditableValues> {
    static contextType = TrialDiscontinuedDialogContext;
    public isFormValid(): boolean {
        return this.validateValues({
            firstName: isNotEmpty,
            lastName: isNotEmpty,
        });
    }
    private isFieldVisible = isFieldVisible(this.props.currentValues.localeFormat);
    public render() {
        const translate = this.props.lee.translate;
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        const identityTitleOptions: IdentityTitleOption[] = [
            {
                label: translate(I18NKEYS.MR),
                value: IdentityTitle.Mr,
            },
            {
                label: translate(I18NKEYS.MME),
                value: IdentityTitle.Mrs,
            },
            {
                label: translate(I18NKEYS.MLLE),
                value: IdentityTitle.Miss,
            },
            {
                label: translate(I18NKEYS.MS),
                value: IdentityTitle.Ms,
            },
            {
                label: translate(I18NKEYS.MX),
                value: IdentityTitle.Mx,
            },
            {
                label: translate(I18NKEYS.NONE_OF_THESE),
                value: IdentityTitle.NoneOfThese,
            },
        ];
        const uniqueIdentityTitleOptions: IdentityTitleOption[] = uniqBy((identityTitleOption) => identityTitleOption.label, identityTitleOptions);
        const currentTitleOption: IdentityTitleOption = uniqueIdentityTitleOptions.find(({ value }) => this.state.values.title === value) ?? uniqueIdentityTitleOptions[uniqueIdentityTitleOptions.length - 1];
        return (<>
        <div className={styles.containerBlock}>
          {this.isFieldVisible(Field.TITLE, this.state.values.title ?? '') && (<DetailSelect label={translate(I18NKEYS.TITLE_LABEL)} placeholder={currentTitleOption.label} dataName="title" options={uniqueIdentityTitleOptions} defaultOption={currentTitleOption} onChange={this.handleChange} disabled={!!isDisabled}/>)}

          {this.isFieldVisible(Field.FIRSTNAME, this.state.values.firstName) && (<DetailField type="text" label={translate(I18NKEYS.FIRSTNAME)} placeholder={translate(I18NKEYS.FIRSTNAME_PLACEHOLDER)} dataName="firstName" value={this.state.values.firstName} error={this.state.errors.firstName
                    ? translate(I18NKEYS.FIELD_REQUIRED)
                    : undefined} onChange={this.handleChange} disabled={!!isDisabled}/>)}

          {this.isFieldVisible(Field.MIDDLENAME, this.state.values.middleName) && (<DetailField type="text" label={translate(I18NKEYS.MIDDLENAME)} placeholder={translate(I18NKEYS.MIDDLENAME_PLACEHOLDER)} dataName="middleName" value={this.state.values.middleName} error={this.state.errors.middleName} onChange={this.handleChange} disabled={!!isDisabled}/>)}

          {this.isFieldVisible(Field.LASTNAME, this.state.values.lastName) && (<DetailField type="text" label={translate(I18NKEYS.LASTNAME)} placeholder={translate(I18NKEYS.LASTNAME_PLACEHOLDER)} dataName="lastName" value={this.state.values.lastName} error={this.state.errors.lastName
                    ? translate(I18NKEYS.FIELD_REQUIRED)
                    : undefined} onChange={this.handleChange} disabled={!!isDisabled}/>)}

          {this.isFieldVisible(Field.LASTNAME2, this.state.values.lastName2) && (<DetailField type="text" label={translate(I18NKEYS.LASTNAME2)} placeholder={translate(I18NKEYS.LASTNAME2_PLACEHOLDER)} dataName="lastName2" value={this.state.values.lastName2} error={this.state.errors.lastName2} onChange={this.handleChange} disabled={!!isDisabled}/>)}
        </div>

        <div className={styles.containerBlock}>
          {this.isFieldVisible(Field.PSEUDO, this.state.values.pseudo) && (<DetailField type="text" label={translate(I18NKEYS.PSEUDO)} placeholder={translate(I18NKEYS.PSEUDO_PLACEHOLDER)} dataName="pseudo" value={this.state.values.pseudo} error={this.state.errors.pseudo} onChange={this.handleChange} disabled={!!isDisabled}/>)}

          {this.isFieldVisible(Field.BIRTHDATE, this.state.values.birthDate) && (<DateFieldSelect label={translate(I18NKEYS.BIRTHDATE)} value={dateFormatter(parseISO(this.state.values.birthDate), DATE_FIELD_FORMAT)} monthLabelFormatter={(value) => this.props.lee.translate.shortDate(value, LocaleFormat.MMMM)} dateFormat={DATE_FIELD_FORMAT} sortYears="DESC" onChange={(value: string) => {
                    return this.handleChange(value, 'birthDate');
                }} disabled={!!isDisabled}/>)}

          {this.isFieldVisible(Field.BIRTHPLACE, this.state.values.birthPlace) && (<DetailField type="textDateFieldSelect" label={translate(I18NKEYS.BIRTHPLACE)} placeholder={translate(I18NKEYS.BIRTHPLACE_PLACEHOLDER)} dataName="birthPlace" value={this.state.values.birthPlace} error={this.state.errors.birthPlace} onChange={this.handleChange} disabled={!!isDisabled}/>)}

          <SpaceSelect labelSx={spaceSelectFormLabelSx} spaceId={this.state.values.spaceId ?? ''} onChange={(newSpaceId) => this.handleChange(newSpaceId, 'spaceId')} disabled={!!isDisabled}/>
        </div>
      </>);
    }
}
