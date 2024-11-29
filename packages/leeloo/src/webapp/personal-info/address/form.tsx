import React from "react";
import { GeographicStateValue } from "@dashlane/communication";
import { Address, Country, Phone } from "@dashlane/vault-contracts";
import { SelectField, SelectOption, TextField } from "@dashlane/design-system";
import { TranslateFunction } from "../../../libs/i18n/types";
import { Option as DetailSelectOption } from "../../../libs/dashlane-style/select-field/detail";
import { FrozenStateDialogContext } from "../../../libs/frozen-state/frozen-state-dialog-context";
import GenericForm, { isNotEmpty } from "../../personal-data/edit/form/common";
import {
  getLocaleZone,
  getLocalizedAddressFields,
  LocaleZone,
  LocalizedAddressField,
} from "./settings";
import { getTranslatedAddressCountry } from "../services";
import {
  SpaceSelect,
  spaceSelectFormLabelSx,
} from "../../space-select/space-select";
import { LinkedPhoneSelect } from "./linked-phone-select";
import { ContentCard } from "../../panel/standard/content-card";
import { CountryField } from "../../components/fields/country-field";
interface StateOption extends DetailSelectOption {
  value: GeographicStateValue;
}
interface CountryOption extends DetailSelectOption {
  value: Country;
}
export type AddressFormEditableValues = Omit<
  Address,
  "id" | "lastBackupTime" | "country"
>;
export class AddressForm extends GenericForm<
  AddressFormEditableValues,
  never,
  {
    phones: Phone[];
  }
> {
  static contextType = FrozenStateDialogContext;
  public isFormValid(): boolean {
    return this.validateValues({
      streetName: isNotEmpty,
    });
  }
  private buildCountryOptionList(): CountryOption[] {
    return Object.keys(Country)
      .filter(
        (localeFormat) =>
          localeFormat !== Country[Country.NO_TYPE] &&
          localeFormat !== Country[Country.UNIVERSAL]
      )
      .map((localeFormat) => ({
        value: Country[localeFormat],
        label: getTranslatedAddressCountry(
          this.props.lee.translate,
          Country[localeFormat]
        ),
      }))
      .sort((lhs, rhs) =>
        lhs.label.localeCompare(rhs.label, this.props.lee.translate.getLocale())
      );
  }
  private buildStateOptionListForCountry(countryCode: string): StateOption[] {
    const statesCollection =
      this.props.lee.globalState.webapp.geographicStates ?? {};
    const statesMap = statesCollection[countryCode] ?? {};
    return Object.keys(statesMap)
      .map((stateValue: string) => ({
        value: stateValue,
        label: statesMap[stateValue].name,
      }))
      .sort((a, b) => (a.label < b.label ? -1 : 1));
  }
  private renderStreetName(_: TranslateFunction): JSX.Element {
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
    return (
      <TextField
        key="streetName"
        required
        label={_("full_address_label")}
        placeholder={_("placeholder_no_full_address")}
        data-name="streetName"
        value={this.state.values.streetName}
        onChange={this.handleChange}
        error={this.state.errors["streetName"]}
        readOnly={!!isDisabled}
      />
    );
  }
  private renderZipCode(_: TranslateFunction): JSX.Element {
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
    return (
      <TextField
        key="zipCode"
        label={_("zip_code_label")}
        placeholder={_("placeholder_no_zip_code")}
        data-name="zipCode"
        value={this.state.values.zipCode}
        onChange={this.handleChange}
        readOnly={!!isDisabled}
      />
    );
  }
  private renderCity(_: TranslateFunction): JSX.Element {
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
    return (
      <TextField
        key="city"
        label={_("city_label")}
        placeholder={_("placeholder_no_city")}
        data-name="city"
        value={this.state.values.city}
        onChange={this.handleChange}
        readOnly={!!isDisabled}
      />
    );
  }
  private renderState(_: TranslateFunction): JSX.Element {
    const stateOptions: StateOption[] = this.buildStateOptionListForCountry(
      this.state.values.localeFormat
    );
    const currentStateOption: StateOption =
      stateOptions.find((item) => item.value === this.state.values.state) ??
      stateOptions[0];
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
    return (
      <SelectField
        key={`states_${this.state.values.localeFormat}`}
        label={
          getLocaleZone(this.state.values.localeFormat) ===
          LocaleZone.UNITEDKINGDOM
            ? _("county_label")
            : _("state_label")
        }
        data-name="state"
        value={currentStateOption.value}
        placeholder={this.state.values.state}
        onChange={(value: string) => this.handleChange(value, "state")}
        readOnly={!!isDisabled}
      >
        {stateOptions.map((stateOption) => {
          return (
            <SelectOption key={stateOption.value} value={stateOption.value}>
              {stateOption.label}
            </SelectOption>
          );
        })}
      </SelectField>
    );
  }
  private renderCountry(_: TranslateFunction): JSX.Element {
    const countryOptions: CountryOption[] = this.buildCountryOptionList();
    const currentCountryOption: CountryOption =
      countryOptions.find(
        (item) => item.value === this.state.values.localeFormat
      ) ?? countryOptions[0];
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
    return (
      <CountryField
        label={_("country_label")}
        placeholder={currentCountryOption.label}
        value={currentCountryOption.value}
        disabled={isDisabled}
        options={countryOptions}
        onChange={(value: string) => {
          const countryCode = value;
          const statesMap = this.buildStateOptionListForCountry(countryCode);
          this.handleChanges({
            localeFormat: countryCode,
            state:
              statesMap && Object.keys(statesMap).length
                ? Object.keys(statesMap)[0]
                : "",
          });
        }}
      />
    );
  }
  private renderStreetNumber(_: TranslateFunction): JSX.Element {
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
    return (
      <TextField
        key="streetNumber"
        label={_("street_number_label")}
        placeholder={_("placeholder_no_street_number")}
        data-name="streetNumber"
        value={this.state.values.streetNumber}
        onChange={this.handleChange}
        disabled={!!isDisabled}
      />
    );
  }
  private renderLocalizedFields(): React.ReactNode[] {
    const _ = this.props.lee.translate.namespace(
      "webapp_personal_info_edition_address_"
    );
    const fieldToRenderer = {
      [LocalizedAddressField.streetName]: this.renderStreetName,
      [LocalizedAddressField.city]: this.renderCity,
      [LocalizedAddressField.country]: this.renderCountry,
      [LocalizedAddressField.zipCode]: this.renderZipCode,
      [LocalizedAddressField.streetNumber]: this.renderStreetNumber,
      [LocalizedAddressField.state]: this.renderState,
    };
    return getLocalizedAddressFields(this.state.values.localeFormat).map(
      (field: LocalizedAddressField): React.ReactNode => {
        return field in fieldToRenderer
          ? fieldToRenderer[field].call(this, _)
          : null;
      }
    );
  }
  public render() {
    const _ = this.props.lee.translate.namespace(
      "webapp_personal_info_edition_address_"
    );
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
    return (
      <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <ContentCard
          title={_("content_card_details_label")}
          additionalSx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {this.renderLocalizedFields()}
          <TextField
            label={_("receiver_label")}
            placeholder={_("placeholder_no_receiver")}
            data-name="receiver"
            value={this.state.values.receiver}
            onChange={this.handleChange}
            disabled={!!isDisabled}
          />
          <TextField
            label={_("building_label")}
            placeholder={_("placeholder_no_building")}
            data-name="building"
            value={this.state.values.building}
            onChange={this.handleChange}
            disabled={!!isDisabled}
          />
          <TextField
            label={_("floor_label")}
            placeholder={_("placeholder_no_floor")}
            data-name="floor"
            value={this.state.values.floor}
            onChange={this.handleChange}
            disabled={!!isDisabled}
          />
          <TextField
            label={_("door_label")}
            placeholder={_("placeholder_no_door")}
            data-name="door"
            value={this.state.values.door}
            onChange={this.handleChange}
            disabled={!!isDisabled}
          />
          <TextField
            label={_("digit_code_label")}
            placeholder={_("placeholder_no_digit_code")}
            data-name="digitCode"
            value={this.state.values.digitCode}
            onChange={this.handleChange}
            disabled={!!isDisabled}
          />
          <LinkedPhoneSelect
            linkedPhoneId={this.state.values.linkedPhoneId}
            handleChange={(value: string) =>
              this.handleChange(value, "linkedPhoneId")
            }
            disabled={!!isDisabled}
          />
        </ContentCard>
        <ContentCard
          title={_("content_card_organization_label")}
          additionalSx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <TextField
            label={_("name_label")}
            placeholder={_("placeholder_no_name")}
            data-name="itemName"
            value={this.state.values.itemName}
            onChange={this.handleChange}
            disabled={!!isDisabled}
          />
          <SpaceSelect
            isUsingNewDesign
            labelSx={spaceSelectFormLabelSx}
            spaceId={this.state.values.spaceId ?? ""}
            onChange={(newSpaceId) => this.handleChange(newSpaceId, "spaceId")}
            disabled={!!isDisabled}
          />
        </ContentCard>
      </div>
    );
  }
}
