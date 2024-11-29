import { memo } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import { useIsAccountRecoveryEnabled } from "../../../webapp/account/security-settings/hooks/useIsAccountRecoveryEnabled";
import { Tab, TabMenu } from "../../page/tab-menu/tab-menu";
import { useGetAccountRecoveryRequestsCount } from "./useAccountRecoveryRequests";
import { useActivityInfobox } from "../../helpers/use-activity-infobox";
interface Props {
  title: string;
}
const I18N_KEYS = {
  TAB_ACTIVITY_LOGS: "team_activity_header_tab_activity_logs",
  TAB_MPR_REQUESTS: "team_activity_header_tab_mpr_requests",
  SUBTITLE: "team_activity_header_subtitle_markup",
};
export const HeaderComponent = ({ title }: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const accountRecoveryRequestsCount = useGetAccountRecoveryRequestsCount();
  const isAccountRecoveryEnabled = useIsAccountRecoveryEnabled();
  const activityInfoboxDetails = useActivityInfobox();
  const requestCount =
    accountRecoveryRequestsCount.status === DataStatus.Success &&
    accountRecoveryRequestsCount.data;
  const getTabs = () => {
    const tabs: Tab[] = [
      {
        label: translate(I18N_KEYS.TAB_ACTIVITY_LOGS),
        url: `${routes.teamActivityRoutePath}/recent`,
      },
    ];
    if (
      isAccountRecoveryEnabled.status === DataStatus.Success &&
      isAccountRecoveryEnabled.data
    ) {
      tabs.push({
        label: translate(I18N_KEYS.TAB_MPR_REQUESTS),
        url: `${routes.teamActivityRoutePath}/requests`,
        notifications: !requestCount ? 0 : requestCount,
      });
    }
    return tabs;
  };
  return (
    <TabMenu
      title={title}
      subtitle={translate.markup(
        I18N_KEYS.SUBTITLE,
        {},
        { linkTarget: "_blank" }
      )}
      tabs={getTabs()}
      extraInfo={activityInfoboxDetails?.activityInfobox}
      hasInfobox={activityInfoboxDetails?.hasInfobox}
    />
  );
};
export const Header = memo(HeaderComponent);
