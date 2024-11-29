import { uniqBy } from "ramda";
import { Identity, IdentityTitle } from "@dashlane/vault-contracts";
import {
  DateField,
  SelectField,
  SelectOption,
  TextField,
} from "@dashlane/design-system";
import GenericForm, { isNotEmpty } from "../../personal-data/edit/form/common";
import { Option as DetailSelectOption } from "../../../libs/dashlane-style/select-field/detail";
import { FrozenStateDialogContext } from "../../../libs/frozen-state/frozen-state-dialog-context";
import {
  SpaceSelect,
  spaceSelectFormLabelSx,
} from "../../space-select/space-select";
import { Field, isFieldVisible } from "./settings";
import { ContentCard } from "../../panel/standard/content-card";
const I18NKEYS = {
  TITLE_LABEL: "webapp_personal_info_edition_identity_title_label",
  FIELD_REQUIRED: "webapp_personal_info_edition_identity_error",
  FIRSTNAME: "webapp_personal_info_edition_identity_firstname_label",
  FIRSTNAME_PLACEHOLDER:
    "webapp_personal_info_edition_identity_placeholder_no_firstname",
  MIDDLENAME: "webapp_personal_info_edition_identity_middlename_label",
  MIDDLENAME_PLACEHOLDER:
    "webapp_personal_info_edition_identity_placeholder_no_middlename",
  LASTNAME: "webapp_personal_info_edition_identity_lastname_label",
  LASTNAME_PLACEHOLDER:
    "webapp_personal_info_edition_identity_placeholder_no_lastname",
  LASTNAME2: "webapp_personal_info_edition_identity_lastname2_label",
  LASTNAME2_PLACEHOLDER:
    "webapp_personal_info_edition_identity_placeholder_no_lastname2",
  PSEUDO: "webapp_personal_info_edition_identity_pseudo_label",
  PSEUDO_PLACEHOLDER:
    "webapp_personal_info_edition_identity_placeholder_no_pseudo",
  BIRTHDATE: "webapp_personal_info_edition_identity_birthdate_label",
  BIRTHPLACE: "webapp_personal_info_edition_identity_birthplace_label",
  BIRTHPLACE_PLACEHOLDER:
    "webapp_personal_info_edition_identity_placeholder_no_birthplace",
  MR: "webapp_personal_info_edition_identity_title_mr",
  MME: "webapp_personal_info_edition_identity_title_mrs",
  MLLE: "webapp_personal_info_edition_identity_title_miss",
  MS: "webapp_personal_info_edition_identity_title_ms",
  MX: "webapp_personal_info_edition_identity_title_mx",
  NONE_OF_THESE: "webapp_personal_info_edition_identity_title_none_of_these",
  DETAILS_CONTENT_LABEL:
    "webapp_payment_edition_content_identity_details_label",
  ORGANIZATION_CONTENT_LABEL:
    "webapp_payment_edition_content_identity_organization_label",
};
interface IdentityTitleOption extends DetailSelectOption {
  value: IdentityTitle;
}
export type IdentityFormEditableValues = Omit<
  Identity,
  "id" | "lastBackupTime"
>;
export class IdentityForm extends GenericForm<IdentityFormEditableValues> {
  static contextType = FrozenStateDialogContext;
  public isFormValid(): boolean {
    return this.validateValues({
      firstName: isNotEmpty,
      lastName: isNotEmpty,
    });
  }
  private isFieldVisible = isFieldVisible(
    this.props.currentValues.localeFormat
  );
  public render() {
    const translate = this.props.lee.translate;
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
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
    const uniqueIdentityTitleOptions: IdentityTitleOption[] = uniqBy(
      (identityTitleOption) => identityTitleOption.label,
      identityTitleOptions
    );
    const currentTitleOption: IdentityTitleOption =
      uniqueIdentityTitleOptions.find(
        ({ value }) => this.state.values.title === value
      ) ?? uniqueIdentityTitleOptions[uniqueIdentityTitleOptions.length - 1];
    return (
      <div sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <ContentCard
          title={translate(I18NKEYS.DETAILS_CONTENT_LABEL)}
          additionalSx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {this.isFieldVisible(Field.TITLE, this.state.values.title ?? "") && (
            <SelectField
              label={translate(I18NKEYS.TITLE_LABEL)}
              placeholder={currentTitleOption.label}
              data-name="title"
              value={currentTitleOption.value}
              onChange={(value: string) => this.handleChange(value, "title")}
              disabled={!!isDisabled}
            >
              {uniqueIdentityTitleOptions.map((uniqueIdentityTitleOption) => {
                return (
                  <SelectOption
                    key={uniqueIdentityTitleOption.value}
                    value={uniqueIdentityTitleOption.value}
                  >
                    {uniqueIdentityTitleOption.label}
                  </SelectOption>
                );
              })}
            </SelectField>
          )}

          {this.isFieldVisible(
            Field.FIRSTNAME,
            this.state.values.firstName
          ) && (
            <TextField
              required
              label={translate(I18NKEYS.FIRSTNAME)}
              placeholder={translate(I18NKEYS.FIRSTNAME_PLACEHOLDER)}
              data-name="firstName"
              onChange={this.handleChange}
              readOnly={!!isDisabled}
              value={this.state.values.firstName}
              error={this.state.errors.firstName}
              feedback={
                this.state.errors.firstName
                  ? { text: translate(I18NKEYS.FIELD_REQUIRED) }
                  : undefined
              }
            />
          )}

          {this.isFieldVisible(
            Field.MIDDLENAME,
            this.state.values.middleName
          ) && (
            <TextField
              label={translate(I18NKEYS.MIDDLENAME)}
              placeholder={translate(I18NKEYS.MIDDLENAME_PLACEHOLDER)}
              data-name="middleName"
              value={this.state.values.middleName}
              onChange={this.handleChange}
              readOnly={!!isDisabled}
            />
          )}

          {this.isFieldVisible(Field.LASTNAME, this.state.values.lastName) && (
            <TextField
              required
              label={translate(I18NKEYS.LASTNAME)}
              placeholder={translate(I18NKEYS.LASTNAME_PLACEHOLDER)}
              data-name="lastName"
              value={this.state.values.lastName}
              onChange={this.handleChange}
              readOnly={!!isDisabled}
              error={this.state.errors.lastName}
              feedback={
                this.state.errors.lastName
                  ? { text: translate(I18NKEYS.FIELD_REQUIRED) }
                  : undefined
              }
            />
          )}

          {this.isFieldVisible(
            Field.LASTNAME2,
            this.state.values.lastName2
          ) && (
            <TextField
              label={translate(I18NKEYS.LASTNAME2)}
              placeholder={translate(I18NKEYS.LASTNAME2_PLACEHOLDER)}
              data-name="lastName2"
              value={this.state.values.lastName2}
              onChange={this.handleChange}
              readOnly={!!isDisabled}
            />
          )}

          {this.isFieldVisible(Field.PSEUDO, this.state.values.pseudo) && (
            <TextField
              label={translate(I18NKEYS.PSEUDO)}
              placeholder={translate(I18NKEYS.PSEUDO_PLACEHOLDER)}
              data-name="pseudo"
              value={this.state.values.pseudo}
              onChange={this.handleChange}
              readOnly={!!isDisabled}
            />
          )}

          {this.isFieldVisible(
            Field.BIRTHDATE,
            this.state.values.birthDate
          ) && (
            <DateField
              value={this.state.values.birthDate}
              calendarButtonLabel={translate(I18NKEYS.BIRTHDATE)}
              label={translate(I18NKEYS.BIRTHDATE)}
              onChange={(value) => {
                this.handleChange(value.target.value, "birthDate");
              }}
              readOnly={!!isDisabled}
            />
          )}

          {this.isFieldVisible(
            Field.BIRTHPLACE,
            this.state.values.birthPlace
          ) && (
            <TextField
              label={translate(I18NKEYS.BIRTHPLACE)}
              placeholder={translate(I18NKEYS.BIRTHPLACE_PLACEHOLDER)}
              data-name="birthPlace"
              value={this.state.values.birthPlace}
              onChange={this.handleChange}
              readOnly={!!isDisabled}
            />
          )}
        </ContentCard>
        <SpaceSelect
          isUsingNewDesign
          wrapInContentCard
          contentCardLabel={translate(I18NKEYS.ORGANIZATION_CONTENT_LABEL)}
          labelSx={spaceSelectFormLabelSx}
          spaceId={this.state.values.spaceId ?? ""}
          onChange={(newSpaceId) => this.handleChange(newSpaceId, "spaceId")}
          disabled={!!isDisabled}
        />
      </div>
    );
  }
}
