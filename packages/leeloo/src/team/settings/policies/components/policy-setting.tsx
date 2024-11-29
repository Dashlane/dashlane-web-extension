import { Badge, Heading, Infobox, Paragraph } from "@dashlane/design-system";
import { CtaButton } from "../../components/cta-button";
import { SX_STYLES } from "../constants";
import {
  SettingField,
  SettingFieldProps,
  SettingSelectField,
  SettingTextField,
} from "../types";
import { PolicyTextField } from "./policy-text-field";
import { PolicySelectField } from "./policy-select-field";
import { PolicySwitchField } from "./policy-switch-field";
export type PolicySettingProps = SettingFieldProps & {
  field: SettingField;
};
const FieldInput = (props: PolicySettingProps) => {
  const { field, ...rest } = props;
  switch (field.type) {
    case "text":
      return <PolicyTextField field={field as SettingTextField} {...rest} />;
    case "select":
      return (
        <PolicySelectField field={field as SettingSelectField} {...rest} />
      );
    case "switch":
      return <PolicySwitchField {...props} />;
    case "cta":
      return <CtaButton onClick={field.ctaAction} content={field.ctaLabel} />;
    default:
      return null;
  }
};
export const PolicySetting = (props: PolicySettingProps) => {
  const { field } = props;
  return (
    <div key={field.feature} sx={{ width: "100%" }}>
      <div
        sx={{
          display: "flex",
          gap: "40px",
          justifyContent: "space-between",
        }}
      >
        <div sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Heading
            as="h3"
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
            sx={
              field.type === "select" || field.type === "text"
                ? SX_STYLES.SETTINGS_LABEL_MARGIN_TOP
                : {}
            }
            id={field.feature}
          >
            {field.label.split("//").map((labelFragment, index) => {
              if (index % 2) {
                return (
                  <span
                    key={labelFragment}
                    sx={{ color: "ds.text.oddity.disabled", fontWeight: "300" }}
                  >
                    {labelFragment}
                  </span>
                );
              } else {
                return labelFragment;
              }
            })}
          </Heading>
          {field.badgeLabel ? (
            <Badge
              label={field.badgeLabel}
              mood="brand"
              iconName={field.badgeIconName}
              layout="iconLeading"
            />
          ) : null}
          {field.helperLabel ? (
            <Paragraph
              id="helper-label-panel"
              textStyle="ds.body.standard.regular"
              color="ds.text.neutral.quiet"
            >
              {field.helperLabel}
            </Paragraph>
          ) : null}
          {field.infoBox ? (
            <Infobox
              size="large"
              title={field.infoBox.title}
              description={field.infoBox.description}
              mood={field.infoBox.mood ?? "neutral"}
            />
          ) : null}
          {(field.type === "text" ||
            field.type === "select" ||
            field.type === "cta") && (
            <div>
              <FieldInput {...props} />
            </div>
          )}
        </div>
        {field.type === "switch" && (
          <div>
            <FieldInput {...props} />
          </div>
        )}
      </div>
    </div>
  );
};
