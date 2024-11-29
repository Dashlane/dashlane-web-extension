import { Button, Infobox } from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import { AccountInfo } from "@dashlane/communication";
import { isAccountTeamTrialBusiness } from "../../../../libs/account/helpers";
import { useSubscriptionCode } from "../../../../libs/hooks/use-subscription-code";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
import { openUrl } from "../../../../libs/external-urls";
import { logEvent } from "../../../../libs/logs/logEvent";
import { BUSINESS_BUY } from "../../../urls";
const I18N_KEYS = {
  TITLE: "team_settings_active_directory_paywall_title",
  DESCRIPTION: "team_settings_active_directory_paywall_description",
  BUY: "team_settings_active_directory_paywall_buy",
  UPGRADE: "team_settings_active_directory_paywall_upgrade",
};
interface ActiveDirectoryPaywallProps {
  accountInfo: AccountInfo;
}
export const ActiveDirectoryPaywall = ({
  accountInfo,
}: ActiveDirectoryPaywallProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const subscriptionCode = useSubscriptionCode();
  const handleClickOnBuyDashlane = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.UpgradeBusinessTier,
        clickOrigin: ClickOrigin.DirectorySyncPaywallPage,
      })
    );
    openUrl(`${BUSINESS_BUY}?plan=business&subCode=${subscriptionCode ?? ""}`);
  };
  if (!accountInfo?.premiumStatus) {
    return null;
  }
  return (
    <Infobox
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
      actions={[
        isAccountTeamTrialBusiness(accountInfo.premiumStatus) ? (
          <Button key="buy" onClick={handleClickOnBuyDashlane}>
            {translate(I18N_KEYS.BUY)}
          </Button>
        ) : (
          <Link
            key="upgrade"
            to={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
          >
            <Button>{translate(I18N_KEYS.UPGRADE)}</Button>
          </Link>
        ),
      ]}
      size="large"
      sx={{ marginBottom: "32px" }}
    />
  );
};
