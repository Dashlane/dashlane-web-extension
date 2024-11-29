import { Heading } from "@dashlane/design-system";
import PrimaryButton from "../../../../libs/dashlane-style/buttons/modern/primary";
import {
  SettingField,
  SettingFieldProps,
  SettingRowModel,
  SettingTextWithButton,
} from "../types";
import { SX_STYLES } from "../constants";
import { SettingsGroupHeading } from "../../components/layout/settings-group-heading";
import { PolicySetting } from "./policy-setting";
import { QuickDisableOfSmartSpaceManagementSetting } from "../smart-space-management/quick-disable-of-smart-space-management-setting";
export type PolicySettingRowProps = SettingFieldProps & {
  settingRow: SettingRowModel;
};
export interface TextSettingWithButtonProps {
  textWithButton: SettingTextWithButton;
}
export const TextSettingWithButton = ({
  textWithButton,
}: TextSettingWithButtonProps) => {
  return (
    <div
      key={textWithButton.label}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        marginBottom: "32px",
        marginTop: "7px",
      }}
    >
      <div>
        <Heading
          as="h3"
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
          sx={SX_STYLES.SETTINGS_LABEL_MARGIN_TOP}
        >
          {textWithButton.label.split("//").map((labelFragment, index) => {
            if (index % 2) {
              return (
                <span
                  sx={{
                    color: "ds.text.oddity.disabled",
                    fontWeight: "300",
                  }}
                  key={labelFragment}
                >
                  {labelFragment}
                </span>
              );
            } else {
              return labelFragment;
            }
          })}
        </Heading>
        {textWithButton.helperLabel ? (
          <div id="helper-label-panel" sx={SX_STYLES.HELPER_LABEL_PANEL}>
            {textWithButton.helperLabel}
          </div>
        ) : null}
      </div>
      <div>
        <PrimaryButton
          label={textWithButton.buttonLabel}
          onClick={textWithButton?.onClick}
        />
      </div>
    </div>
  );
};
export const PolicySettingRow = ({
  settingRow,
  ...rest
}: PolicySettingRowProps) => {
  switch (settingRow.type) {
    case "header":
      return <SettingsGroupHeading header={settingRow} />;
    case "textwithbutton":
      return <TextSettingWithButton textWithButton={settingRow} />;
    case "quickDisable":
      return (
        <QuickDisableOfSmartSpaceManagementSetting settingRow={settingRow} />
      );
    default:
      return <PolicySetting field={settingRow as SettingField} {...rest} />;
  }
};
