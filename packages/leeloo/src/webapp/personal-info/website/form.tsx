import { Website } from "@dashlane/vault-contracts";
import { TextField } from "@dashlane/design-system";
import { FrozenStateDialogContext } from "../../../libs/frozen-state/frozen-state-dialog-context";
import GenericForm, { isNotEmpty } from "../../personal-data/edit/form/common";
import {
  SpaceSelect,
  spaceSelectFormLabelSx,
} from "../../space-select/space-select";
import { ContentCard } from "../../panel/standard/content-card";
export type WebsiteFormEditableValues = Pick<
  Website,
  "itemName" | "URL" | "spaceId"
>;
export class WebsiteForm extends GenericForm<WebsiteFormEditableValues> {
  static contextType = FrozenStateDialogContext;
  public isFormValid(): boolean {
    return this.validateValues({
      URL: isNotEmpty,
    });
  }
  public render() {
    const _ = this.props.lee.translate.namespace(
      "webapp_personal_info_edition_website_"
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
            key={"website"}
            label={_("website_label")}
            placeholder={_("placeholder_no_website")}
            data-name="URL"
            value={this.state.values.URL}
            error={this.state.errors.URL}
            onChange={this.handleChange}
            readOnly={!!isDisabled}
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
            key={"name"}
            label={_("name_label")}
            placeholder={_("placeholder_no_name")}
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
