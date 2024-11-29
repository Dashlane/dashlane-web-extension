import { Button, Infobox } from "@dashlane/design-system";
import { teamAdminNotificationsApi } from "@dashlane/team-admin-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  INFOBOX_TITLE: "team_activity_logs_infobox_title",
  INFOBOX_DESCRIPTION: "team_activity_logs_infobox_description",
  CONFIRM: "team_activity_logs_infobox_confirm",
};
export const UpgradeBusinessInfobox = () => {
  const { translate } = useTranslate();
  const adminNotificationCommands = useModuleCommands(
    teamAdminNotificationsApi
  );
  const handleDismiss = () => {
    adminNotificationCommands.markActivityLogsInfoboxSeen();
  };
  return (
    <Infobox
      title={translate(I18N_KEYS.INFOBOX_TITLE)}
      description={translate(I18N_KEYS.INFOBOX_DESCRIPTION)}
      size="large"
      actions={[
        <Button key="dismiss" intensity="quiet" onClick={handleDismiss}>
          {translate(I18N_KEYS.CONFIRM)}
        </Button>,
      ]}
      sx={{ marginBottom: "32px" }}
    />
  );
};
