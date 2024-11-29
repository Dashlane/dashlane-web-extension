import { Button, Infobox } from "@dashlane/design-system";
import {
  DataStatus,
  useFeatureFlip,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { teamAdminNotificationsApi } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  TITLE: "team_settings_starter_repackage_policy_change_title",
  DESCRIPTION: "team_settings_starter_repackage_policy_change_description",
  CTA: "team_settings_starter_repackage_policy_change_cta",
};
interface StarterPolicyChangePaywallProps {
  className?: string;
}
const REPACKAGE_NOTICE_FF = "monetization_extension_policies_revert_notice";
export const StarterPoliciesChangePaywall = ({
  className,
}: StarterPolicyChangePaywallProps) => {
  const { translate } = useTranslate();
  const hasNoticeFF = useFeatureFlip(REPACKAGE_NOTICE_FF);
  const adminNotificationCommands = useModuleCommands(
    teamAdminNotificationsApi
  );
  const HasSeenStarterRepackagePolicyInfoboxQuery = useModuleQuery(
    teamAdminNotificationsApi,
    "HasSeenStarterRepackagePolicyInfobox"
  );
  const onDismissInfobox = () => {
    adminNotificationCommands.markStarterRepackagePolicyInfoboxSeen();
  };
  if (
    !hasNoticeFF ||
    HasSeenStarterRepackagePolicyInfoboxQuery.status !== DataStatus.Success ||
    HasSeenStarterRepackagePolicyInfoboxQuery.data
  ) {
    return null;
  }
  return (
    <Infobox
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
      size="large"
      actions={[
        <Button key="dismiss" onClick={onDismissInfobox}>
          {translate(I18N_KEYS.CTA)}
        </Button>,
      ]}
      sx={{ whiteSpace: "break-spaces" }}
      className={className}
    />
  );
};
