import { memo } from 'react';
import { jsx } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { useIsAccountRecoveryEnabled } from 'webapp/account/security-settings/hooks/useIsAccountRecoveryEnabled';
import { Tab, TabMenu } from 'team/page/tab-menu/tab-menu';
import { useGetAccountRecoveryRequestsCount } from 'team/activity/header/useAccountRecoveryRequests';
interface Props {
    title: string;
}
const I18N_KEYS = {
    TAB_ACTIVITY_LOGS: 'team_activity_header_tab_activity_logs',
    TAB_MPR_REQUESTS: 'team_activity_header_tab_mpr_requests',
    SUBTITLE: 'team_activity_header_subtitle_markup',
};
export const HeaderComponent = ({ title }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const accountRecoveryRequestsCount = useGetAccountRecoveryRequestsCount();
    const isAccountRecoveryEnabled = useIsAccountRecoveryEnabled();
    const requestCount = accountRecoveryRequestsCount.status === DataStatus.Success &&
        accountRecoveryRequestsCount.data;
    const getTabs = () => {
        const tabs: Tab[] = [];
        tabs.push({
            label: translate(I18N_KEYS.TAB_ACTIVITY_LOGS),
            url: `${routes.teamActivityRoutePath}/recent`,
        });
        if (isAccountRecoveryEnabled.status === DataStatus.Success &&
            isAccountRecoveryEnabled.data) {
            tabs.push({
                label: translate(I18N_KEYS.TAB_MPR_REQUESTS),
                url: `${routes.teamActivityRoutePath}/requests`,
                notifications: !requestCount ? 0 : requestCount,
            });
        }
        return tabs;
    };
    const subtitle = translate.markup(I18N_KEYS.SUBTITLE, {}, { linkTarget: '_blank' });
    return <TabMenu title={title} subtitle={subtitle} tabs={getTabs()}/>;
};
export const Header = memo(HeaderComponent);
