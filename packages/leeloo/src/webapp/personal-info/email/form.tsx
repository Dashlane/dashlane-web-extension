import { find, head, propEq } from "ramda";
import { Email, EmailType } from "@dashlane/vault-contracts";
import { SelectField, SelectOption, TextField } from "@dashlane/design-system";
import { Option as DetailSelectOption } from "../../../libs/dashlane-style/select-field/detail";
import { FrozenStateDialogContext } from "../../../libs/frozen-state/frozen-state-dialog-context";
import GenericForm, { isEmail } from "../../personal-data/edit/form/common";
import {
  SpaceSelect,
  spaceSelectFormLabelSx,
} from "../../space-select/space-select";
import { ContentCard } from "../../panel/standard/content-card";
interface EmailTypeOption extends DetailSelectOption {
  value: EmailType;
}
export type EmailFormEditableValues = Pick<
  Email,
  "emailAddress" | "itemName" | "spaceId" | "type"
>;
export class EmailForm extends GenericForm<EmailFormEditableValues> {
  static contextType = FrozenStateDialogContext;
  public isFormValid(): boolean {
    return this.validateValues({
      emailAddress: isEmail,
    });
  }
  public render() {
    const _ = this.props.lee.translate.namespace(
      "webapp_personal_info_edition_email_"
    );
    const { shouldShowFrozenStateDialog: isDisabled } = this.context;
    const emailTypeOptions: EmailTypeOption[] = [
      {
        label: _("perso_type"),
        value: EmailType.Perso,
      },
      {
        label: _("pro_type"),
        value: EmailType.Pro,
      },
    ];
    const currentTypeOption: EmailTypeOption =
      find<EmailTypeOption>(
        propEq("value", this.state.values.type),
        emailTypeOptions
      ) ?? head(emailTypeOptions);
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
          <TextField
            type="email"
            required
            label={_("email_label")}
            placeholder={_("placeholder_no_email")}
            data-name="emailAddress"
            value={this.state.values.emailAddress}
            error={this.state.errors.emailAddress}
            onChange={this.handleChange}
            readOnly={!!isDisabled}
          />

          <SelectField
            label={_("type_label")}
            placeholder={currentTypeOption.label}
            data-name="type"
            value={currentTypeOption.value}
            onChange={(value: string) => {
              this.handleChange(value, "type");
            }}
            readOnly={!!isDisabled}
          >
            {emailTypeOptions.map((emailTypeOption) => {
              return (
                <SelectOption
                  key={emailTypeOption.value}
                  value={emailTypeOption.value}
                >
                  {emailTypeOption.label}
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
            label={_("name_label")}
            placeholder={_("placeholder_no_emailName")}
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
