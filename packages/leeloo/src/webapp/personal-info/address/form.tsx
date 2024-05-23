import React from 'react';
import { GeographicStateValue } from '@dashlane/communication';
import { Address, Country, Phone } from '@dashlane/vault-contracts';
import { TranslateFunction } from 'libs/i18n/types';
import DetailField from 'libs/dashlane-style/detail-field';
import DetailSelect, { Option as DetailSelectOption, } from 'libs/dashlane-style/select-field/detail';
import { TrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import GenericForm, { isNotEmpty } from 'webapp/personal-data/edit/form/common';
import { getLocaleZone, getLocalizedAddressFields, LocaleZone, LocalizedAddressField, } from 'webapp/personal-info/address/settings';
import { getTranslatedAddressCountry } from 'webapp/personal-info/services';
import { SpaceSelect, spaceSelectFormLabelSx, } from 'webapp/space-select/space-select';
import { LinkedPhoneSelect } from './linked-phone-select';
import formStyles from 'webapp/personal-data/edit/form/styles.css';
interface StateOption extends DetailSelectOption {
    value: GeographicStateValue;
}
interface CountryOption extends DetailSelectOption {
    value: Country;
}
export type AddressFormEditableValues = Omit<Address, 'anonId' | 'id' | 'lastBackupTime' | 'country'>;
export class AddressForm extends GenericForm<AddressFormEditableValues, never, {
    phones: Phone[];
}> {
    static contextType = TrialDiscontinuedDialogContext;
    public isFormValid(): boolean {
        return this.validateValues({
            streetName: isNotEmpty,
        });
    }
    private buildCountryOptionList(): CountryOption[] {
        return Object.keys(Country)
            .filter((localeFormat) => localeFormat !== Country[Country.NO_TYPE] &&
            localeFormat !== Country[Country.UNIVERSAL])
            .map((localeFormat) => ({
            value: Country[localeFormat],
            label: getTranslatedAddressCountry(this.props.lee.translate, Country[localeFormat]),
        }))
            .sort((lhs, rhs) => lhs.label.localeCompare(rhs.label, this.props.lee.translate.getLocale()));
    }
    private buildStateOptionListForCountry(countryCode: string): StateOption[] {
        const statesCollection = this.props.lee.globalState.webapp.geographicStates ?? {};
        const statesMap = statesCollection[countryCode] ?? {};
        return Object.keys(statesMap)
            .map((stateValue: string) => ({
            value: stateValue,
            label: statesMap[stateValue].name,
        }))
            .sort((a, b) => (a.label < b.label ? -1 : 1));
    }
    private renderStreetName(_: TranslateFunction): JSX.Element {
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        return (<DetailField key="streetName" type="text" label={_('full_address_label')} placeholder={_('placeholder_no_full_address')} dataName="streetName" value={this.state.values.streetName} onChange={this.handleChange} error={this.state.errors['streetName']} disabled={!!isDisabled}/>);
    }
    private renderZipCode(_: TranslateFunction): JSX.Element {
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        return (<DetailField key="zipCode" type="text" label={_('zip_code_label')} placeholder={_('placeholder_no_zip_code')} dataName="zipCode" value={this.state.values.zipCode} onChange={this.handleChange} disabled={!!isDisabled}/>);
    }
    private renderCity(_: TranslateFunction): JSX.Element {
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        return (<DetailField key="city" type="text" label={_('city_label')} placeholder={_('placeholder_no_city')} dataName="city" value={this.state.values.city} onChange={this.handleChange} disabled={!!isDisabled}/>);
    }
    private renderState(_: TranslateFunction): JSX.Element {
        const stateOptions: StateOption[] = this.buildStateOptionListForCountry(this.state.values.localeFormat);
        const currentStateOption: StateOption = stateOptions.find((item) => item.value === this.state.values.state) ??
            stateOptions[0];
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        return (<DetailSelect key={`states_${this.state.values.localeFormat}`} label={getLocaleZone(this.state.values.localeFormat) ===
                LocaleZone.UNITEDKINGDOM
                ? _('county_label')
                : _('state_label')} dataName="state" placeholder={this.state.values.state} defaultOption={currentStateOption} options={stateOptions} onChange={this.handleChange} disabled={!!isDisabled}/>);
    }
    private renderCountry(_: TranslateFunction): JSX.Element {
        const countryOptions: CountryOption[] = this.buildCountryOptionList();
        const currentCountryOption: CountryOption = countryOptions.find((item) => item.value === this.state.values.localeFormat) ?? countryOptions[0];
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        return (<DetailSelect key="country" label={_('country_label')} placeholder={currentCountryOption.label} dataName="localeFormat" defaultOption={currentCountryOption} options={countryOptions} onChange={(event) => {
                const countryCode = event.target.value;
                const statesMap = this.buildStateOptionListForCountry(countryCode);
                this.handleChanges({
                    localeFormat: countryCode,
                    state: statesMap && Object.keys(statesMap).length
                        ? Object.keys(statesMap)[0]
                        : '',
                });
            }} disabled={!!isDisabled}/>);
    }
    private renderStreetNumber(_: TranslateFunction): JSX.Element {
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        return (<DetailField key="streetNumber" type="text" label={_('street_number_label')} placeholder={_('placeholder_no_street_number')} dataName="streetNumber" value={this.state.values.streetNumber} onChange={this.handleChange} disabled={!!isDisabled}/>);
    }
    private renderLocalizedFields(): React.ReactNode[] {
        const _ = this.props.lee.translate.namespace('webapp_personal_info_edition_address_');
        const fieldToRenderer = {
            [LocalizedAddressField.streetName]: this.renderStreetName,
            [LocalizedAddressField.city]: this.renderCity,
            [LocalizedAddressField.country]: this.renderCountry,
            [LocalizedAddressField.zipCode]: this.renderZipCode,
            [LocalizedAddressField.streetNumber]: this.renderStreetNumber,
            [LocalizedAddressField.state]: this.renderState,
        };
        return getLocalizedAddressFields(this.state.values.localeFormat).map((field: LocalizedAddressField): React.ReactNode => {
            return field in fieldToRenderer
                ? fieldToRenderer[field].call(this, _)
                : null;
        });
    }
    public render() {
        const _ = this.props.lee.translate.namespace('webapp_personal_info_edition_address_');
        const { shouldShowTrialDiscontinuedDialog: isDisabled } = this.context;
        return (<>
        <div className={formStyles.containerBlock}>
          {this.renderLocalizedFields()}
        </div>
        <div className={formStyles.containerBlock}>
          <DetailField type="text" label={_('name_label')} placeholder={_('placeholder_no_name')} dataName="itemName" value={this.state.values.itemName} onChange={this.handleChange} disabled={!!isDisabled}/>
          <SpaceSelect labelSx={spaceSelectFormLabelSx} spaceId={this.state.values.spaceId ?? ''} onChange={(newSpaceId) => this.handleChange(newSpaceId, 'spaceId')} disabled={!!isDisabled}/>
        </div>
        <div className={formStyles.containerBlock}>
          <DetailField type="text" label={_('receiver_label')} placeholder={_('placeholder_no_receiver')} dataName="receiver" value={this.state.values.receiver} onChange={this.handleChange} disabled={!!isDisabled}/>
          <div className={formStyles.horizontalContainerBlock}>
            <DetailField type="text" label={_('building_label')} placeholder={_('placeholder_no_building')} dataName="building" value={this.state.values.building} onChange={this.handleChange} disabled={!!isDisabled}/>
            <div className={formStyles.secondItem}>
              <DetailField type="text" label={_('floor_label')} placeholder={_('placeholder_no_floor')} dataName="floor" value={this.state.values.floor} onChange={this.handleChange} disabled={!!isDisabled}/>
            </div>
          </div>
          <div className={formStyles.horizontalContainerBlock}>
            <DetailField type="text" label={_('door_label')} placeholder={_('placeholder_no_door')} dataName="door" value={this.state.values.door} onChange={this.handleChange} disabled={!!isDisabled}/>
            <div className={formStyles.secondItem}>
              <DetailField type="text" label={_('digit_code_label')} placeholder={_('placeholder_no_digit_code')} dataName="digitCode" value={this.state.values.digitCode} onChange={this.handleChange} disabled={!!isDisabled}/>
            </div>
          </div>
        </div>
        <div className={formStyles.containerBlock}>
          <LinkedPhoneSelect linkedPhoneId={this.state.values.linkedPhoneId} handleChange={this.handleChange} disabled={!!isDisabled}/>
        </div>
      </>);
    }
}
