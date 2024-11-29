import { find, head, propEq } from "ramda";
import { Country, Phone, PhoneType } from "@dashlane/vault-contracts";
import {
  Flex,
  SelectField,
  SelectOption,
  TextField,
} from "@dashlane/design-system";
import { FrozenStateDialogContext } from "../../../libs/frozen-state/frozen-state-dialog-context";
import GenericForm, { isNotEmpty } from "../../personal-data/edit/form/common";
import {
  SpaceSelect,
  spaceSelectFormLabelSx,
} from "../../space-select/space-select";
import {
  getCallingCodeOption,
  getCountryCallingCodeOptions,
  getPhoneTypeOptions,
} from "./services";
import { ContentCard } from "../../panel/standard/content-card";
export interface PhoneTypeOption {
  label: string;
  value: PhoneType;
}
export interface CallingCodeOption {
  selectedLabel?: string;
  label: string;
  value: Country;
}
export type PhoneFormEditableValues = Pick<
  Phone,
  "localeFormat" | "phoneNumber" | "itemName" | "type" | "spaceId"
>;
export class PhoneForm extends GenericForm<PhoneFormEditableValues> {
  static contextType = FrozenStateDialogContext;
  public isFormValid(): boolean {
    return this.validateValues({
      phoneNumber: isNotEmpty,
    });
  }
  public render() {
    const { lee } = this.props;
    const _ = lee.translate.namespace("webapp_personal_info_edition_phone_");
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
    const phoneTypeOptions: PhoneTypeOption[] = getPhoneTypeOptions(
      lee.translate
    );
    const currentTypeOption: PhoneTypeOption =
      find<PhoneTypeOption>(
        propEq("value", this.state.values.type),
        phoneTypeOptions
      ) ?? head(phoneTypeOptions);
    const countryCallingCodeOptions = getCountryCallingCodeOptions(
      lee.translate
    );
    const currentCallingCodeOption = getCallingCodeOption(lee.translate)(
      this.state.values.localeFormat
    );
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
          <Flex sx={{ gap: "8px" }}>
            <SelectField
              label="Country code"
              placeholder={currentCallingCodeOption.label}
              data-name="localeFormat"
              value={currentCallingCodeOption.value}
              onChange={(value: string) =>
                this.handleChange(value, "localeFormat")
              }
              readOnly={!!isDisabled}
              sx={{ minWidth: "145px" }}
            >
              {countryCallingCodeOptions.map((countryCallingCodeOption) => {
                return (
                  <SelectOption
                    key={countryCallingCodeOption.value}
                    value={countryCallingCodeOption.value}
                    displayValue={
                      countryCallingCodeOption.selectedLabel ??
                      countryCallingCodeOption.label
                    }
                  >
                    {countryCallingCodeOption.label}
                  </SelectOption>
                );
              })}
            </SelectField>

            <TextField
              required
              label={_("number_label")}
              placeholder={_("placeholder_no_number")}
              data-name="phoneNumber"
              value={this.state.values.phoneNumber}
              error={this.state.errors.phoneNumber}
              onChange={this.handleChange}
              readOnly={!!isDisabled}
            />
          </Flex>

          <SelectField
            label={_("type_label")}
            placeholder={currentTypeOption.label}
            value={currentTypeOption.value}
            data-name="type"
            onChange={(value: string) => this.handleChange(value, "type")}
            readOnly={!!isDisabled}
          >
            {phoneTypeOptions.map((phoneTypeOption) => {
              return (
                <SelectOption
                  key={phoneTypeOption.value}
                  value={phoneTypeOption.value}
                >
                  {phoneTypeOption.label}
                </SelectOption>
              );
            })}
          </SelectField>
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
            label={_("phonename_label")}
            placeholder={_("placeholder_no_phonename")}
            data-name="itemName"
            value={this.state.values.itemName}
            onChange={this.handleChange}
            readOnly={!!isDisabled}
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
