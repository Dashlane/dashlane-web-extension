import React from 'react';
import { find, head, propEq } from 'ramda';
import { jsx } from '@dashlane/design-system';
import { Country, Phone, PhoneType } from '@dashlane/vault-contracts';
import DetailField from 'libs/dashlane-style/detail-field';
import DetailSelect, { Option as DetailSelectOption, } from 'libs/dashlane-style/select-field/detail';
import { TrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import GenericForm, { isNotEmpty } from 'webapp/personal-data/edit/form/common';
import styles from 'webapp/personal-data/edit/form/styles.css';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
import { getCallingCodeOption, getCountryCallingCodeOptions, getPhoneTypeOptions, } from './services';
import sharedStyles from 'libs/dashlane-style/select-field/sharedStyle.css';
export interface PhoneTypeOption extends DetailSelectOption {
    value: PhoneType;
}
export interface CallingCodeOption extends DetailSelectOption {
    value: Country;
}
export type PhoneFormEditableValues = Pick<Phone, 'localeFormat' | 'phoneNumber' | 'itemName' | 'type' | 'spaceId'>;
export class PhoneForm extends GenericForm<PhoneFormEditableValues> {
    static contextType = TrialDiscontinuedDialogContext;
    public isFormValid(): boolean {
        return this.validateValues({
            phoneNumber: isNotEmpty,
        });
    }
    public render() {
        const { lee } = this.props;
        const _ = lee.translate.namespace('webapp_personal_info_edition_phone_');
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        const phoneTypeOptions: PhoneTypeOption[] = getPhoneTypeOptions(lee.translate);
        const currentTypeOption: PhoneTypeOption = find<PhoneTypeOption>(propEq('value', this.state.values.type), phoneTypeOptions) ?? head(phoneTypeOptions);
        const callingCodes = lee.globalState.webapp.callingCodes || {};
        const countryCallingCodeOptions = getCountryCallingCodeOptions(lee.translate, callingCodes);
        const currentCallingCodeOption = getCallingCodeOption(lee.translate, callingCodes)(this.state.values.localeFormat);
        return (<>
        <div className={styles.container}>
          <label className={sharedStyles.label} sx={{ color: 'ds.text.neutral.catchy' }} title={_('number_label')}>
            {_('number_label')}
          </label>

          <DetailSelect placeholder={currentCallingCodeOption.label} dataName="localeFormat" options={countryCallingCodeOptions} defaultOption={currentCallingCodeOption} onChange={this.handleChange} disabled={!!isDisabled}/>

          <DetailField type="text" placeholder={_('placeholder_no_number')} dataName="phoneNumber" value={this.state.values.phoneNumber} error={this.state.errors.phoneNumber} onChange={this.handleChange} disabled={!!isDisabled}/>
        </div>

        <DetailField type="text" label={_('phonename_label')} placeholder={_('placeholder_no_phonename')} dataName="itemName" value={this.state.values.itemName} onChange={this.handleChange} disabled={!!isDisabled}/>

        <DetailSelect label={_('type_label')} placeholder={currentTypeOption.label} dataName="type" options={phoneTypeOptions} defaultOption={currentTypeOption} onChange={this.handleChange} disabled={!!isDisabled}/>

        <SpaceSelect labelSx={spaceSelectFormLabelSx} spaceId={this.state.values.spaceId ?? ''} onChange={(newSpaceId) => this.handleChange(newSpaceId, 'spaceId')} disabled={!!isDisabled}/>
      </>);
    }
}
