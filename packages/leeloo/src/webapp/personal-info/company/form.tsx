import { Company } from "@dashlane/vault-contracts";
import { TextField } from "@dashlane/design-system";
import { FrozenStateDialogContext } from "../../../libs/frozen-state/frozen-state-dialog-context";
import GenericForm, { isNotEmpty } from "../../personal-data/edit/form/common";
import {
  SpaceSelect,
  spaceSelectFormLabelSx,
} from "../../space-select/space-select";
import { ContentCard } from "../../panel/standard/content-card";
export type CompanyFormEditableValues = Pick<
  Company,
  "companyName" | "jobTitle" | "spaceId"
>;
export class CompanyForm extends GenericForm<CompanyFormEditableValues> {
  static contextType = FrozenStateDialogContext;
  public isFormValid(): boolean {
    return this.validateValues({
      companyName: isNotEmpty,
    });
  }
  public render() {
    const _ = this.props.lee.translate.namespace(
      "webapp_personal_info_edition_company_"
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
          <TextField
            required
            label={_("name_label")}
            placeholder={_("placeholder_no_name")}
            data-name="companyName"
            value={this.state.values.companyName}
            error={this.state.errors.companyName}
            onChange={this.handleChange}
            readOnly={!!isDisabled}
          />

          <TextField
            label={_("jobTitle_label")}
            placeholder={_("placeholder_no_jobTitle")}
            data-name="jobTitle"
            value={this.state.values.jobTitle}
            onChange={this.handleChange}
            readOnly={!!isDisabled}
          />
        </ContentCard>

        <SpaceSelect
          isUsingNewDesign
          wrapInContentCard
          contentCardLabel={_("content_card_organization_label")}
          labelSx={spaceSelectFormLabelSx}
          spaceId={this.state.values.spaceId ?? ""}
          onChange={(newSpaceId) => this.handleChange(newSpaceId, "spaceId")}
          disabled={!!isDisabled}
        />
      </div>
    );
  }
}
