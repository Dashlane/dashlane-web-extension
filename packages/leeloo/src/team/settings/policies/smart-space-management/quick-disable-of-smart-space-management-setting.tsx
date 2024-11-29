import { Button, Infobox } from "@dashlane/design-system";
import { SettingFieldProps, SettingQuickDisable } from "../types";
import { useAlertQueue } from "../../../alerts/use-alert-queue";
interface QuickDisableOfSmartSpaceManagementSettingProps
  extends SettingFieldProps {
  settingRow: SettingQuickDisable;
}
export const QuickDisableOfSmartSpaceManagementSetting = ({
  settingRow,
  editSettings,
  checkForAuthenticationError,
}: QuickDisableOfSmartSpaceManagementSettingProps) => {
  const { reportTACError } = useAlertQueue();
  const disableSmartSpaceManagement = async () => {
    if (
      !editSettings ||
      !settingRow.featuresToDisable ||
      checkForAuthenticationError?.()
    ) {
      return;
    }
    try {
      await editSettings(settingRow.featuresToDisable);
    } catch (error) {
      reportTACError(error);
    }
  };
  return (
    <Infobox
      sx={{ margin: "16px 0" }}
      title={settingRow.label}
      description={settingRow.description}
      icon={settingRow.icon}
      size="large"
      mood={settingRow.mood}
      actions={[
        settingRow.actions?.secondary ? (
          <Button
            mood={settingRow.mood}
            intensity="quiet"
            icon="ActionOpenExternalLinkOutlined"
            layout="iconLeading"
            key={settingRow.actions?.secondary.label}
            onClick={settingRow.actions?.secondary.onClick}
          >
            {settingRow.actions?.secondary.label}
          </Button>
        ) : null,
        settingRow.actions?.primary ? (
          <Button
            mood={settingRow.mood}
            intensity="catchy"
            key={settingRow.actions?.primary.label}
            onClick={disableSmartSpaceManagement}
          >
            {settingRow.actions?.primary.label}
          </Button>
        ) : null,
      ]}
    />
  );
};
