import { jsx } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { Policies, TeamPolicyUpdates } from '@dashlane/team-admin-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { useIsTeamDiscontinuedAfterTrial } from 'libs/hooks/use-is-team-discontinued-after-trial';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { Lee, LEE_INCORRECT_AUTHENTICATION } from 'lee';
import { useBuyOrUpgradePaywallDetails } from 'team/helpers/use-buy-or-upgrade-paywall-details';
import { useRestrictSharingPaywallDetails } from 'team/helpers/use-restrict-sharing-paywall';
import { useShowQuickDisableSpaceManagement } from 'team/settings/policies/hooks/use-show-quick-disable-space-management';
import { getSettingRows } from './fieldlist';
import { Loader } from 'team/components/loader';
import { DataStatus } from '@dashlane/framework-react';
import { getAuth } from 'user';
import { useEffect } from 'react';
import { logPageView } from 'libs/logs/logEvent';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { SettingsPage } from '..';
import { InviteLinkPolicySettings } from './InviteLink/invite-link-policy-settings';
import { SettingRowModel } from './types';
import { PolicySettingRow } from './components/policy-setting-row';
import { useEditTeamPolicies } from './hooks/use-edit-team-policies';
import { useTeamPolicies } from './hooks/use-team-policies';
export interface Props {
    lee: Lee;
}
export const PoliciesSettings = ({ lee }: Props) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const showPaywallInfo = useBuyOrUpgradePaywallDetails(lee.permission.adminAccess);
    const restrictSharingPaywallDetails = useRestrictSharingPaywallDetails(lee.permission.adminAccess);
    const isTeamDiscontinuedAfterTrial = useIsTeamDiscontinuedAfterTrial();
    const showQuickDisableOfSmartSpaceManagement = useShowQuickDisableSpaceManagement();
    const { reportTACError } = useAlertQueue();
    const { data, status } = useTeamPolicies();
    const editTeamPolicies = useEditTeamPolicies();
    useEffect(() => {
        logPageView(PageView.TacSettingsPolicies);
    }, []);
    const editSettings = async (policyUpdates: TeamPolicyUpdates) => {
        const auth = getAuth(lee.globalState);
        if (Object.keys(policyUpdates).length === 0 || !auth?.teamId) {
            return Promise.resolve();
        }
        await editTeamPolicies({
            teamId: auth.teamId,
            policyUpdates,
        });
    };
    const checkAuth = () => {
        const auth = getAuth(lee.globalState);
        if (!auth) {
            reportTACError(new Error(LEE_INCORRECT_AUTHENTICATION));
            return true;
        }
        return false;
    };
    if (!showPaywallInfo ||
        !restrictSharingPaywallDetails ||
        isTeamDiscontinuedAfterTrial === null ||
        showQuickDisableOfSmartSpaceManagement === null) {
        return <Loader />;
    }
    if (status === DataStatus.Error) {
        reportTACError(new Error('Error loading team policies'));
    }
    const createFieldListFunction = (policies: Policies) => {
        return getSettingRows(translate, showPaywallInfo, restrictSharingPaywallDetails, isTeamDiscontinuedAfterTrial, showQuickDisableOfSmartSpaceManagement, policies, routes);
    };
    return (<SettingsPage title={translate('team_settings_menu_title_policies')} isLoading={status === DataStatus.Loading}>
      <InviteLinkPolicySettings key="inviteLinkPolicy"/>
      {status === DataStatus.Success
            ? createFieldListFunction(data).map((row: SettingRowModel) => (<PolicySettingRow key={row.label} checkForAuthenticationError={checkAuth} policies={data} editSettings={editSettings} settingRow={row}/>))
            : null}
    </SettingsPage>);
};
