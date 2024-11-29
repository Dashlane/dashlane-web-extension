import { Button, Infobox } from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { Link, useRouterGlobalSettingsContext } from "../../../libs/router";
const I18N_KEYS = {
  WARNING_TITLE: "team_group_list_paywall_warning_title",
  BLOCK_TITLE: "team_group_list_paywall_block_title",
  DESCRIPTION: "team_group_list_paywall_description",
  UPGRADE: "team_group_list_paywall_upgrade",
};
interface GroupPaywallProps {
  enforcePaywall: boolean;
  className?: string;
}
export const StarterGroupPaywall = ({
  enforcePaywall,
  className,
}: GroupPaywallProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const handleOnClick = () => {
    logEvent(
      new UserClickEvent({
        clickOrigin: enforcePaywall
          ? ClickOrigin.GroupsStarterLimitReached
          : ClickOrigin.GroupsStarterLimitCloseToBeReached,
        button: HermesButton.UpgradeBusinessTier,
      })
    );
  };
  return (
    <Infobox
      title={
        enforcePaywall
          ? translate(I18N_KEYS.BLOCK_TITLE)
          : translate(I18N_KEYS.WARNING_TITLE)
      }
      description={translate(I18N_KEYS.DESCRIPTION)}
      actions={[
        <Link
          key="upgrade"
          to={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
          onClick={handleOnClick}
        >
          <Button icon="PremiumOutlined" layout="iconLeading" size="small">
            {translate(I18N_KEYS.UPGRADE)}
          </Button>
        </Link>,
      ]}
      mood={enforcePaywall ? "warning" : "brand"}
      size="large"
      className={className}
    />
  );
};
