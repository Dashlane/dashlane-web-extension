import { useEffect } from "react";
import { PageView } from "@dashlane/hermes";
import { TeamPolicyUpdates } from "@dashlane/team-admin-contracts";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useIsTeamDiscontinuedAfterTrial } from "../../../libs/hooks/use-is-team-discontinued-after-trial";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { logPageView } from "../../../libs/logs/logEvent";
import { Lee, LEE_INCORRECT_AUTHENTICATION } from "../../../lee";
import { useBuyOrUpgradePaywallDetails } from "../../helpers/use-buy-or-upgrade-paywall-details";
import { useRestrictSharingPaywallDetails } from "../../helpers/use-restrict-sharing-paywall";
import { Loader } from "../../components/loader";
import { getAuth } from "../../../user";
import { useAlertQueue } from "../../alerts/use-alert-queue";
import { SettingsPage } from "..";
import { UserAccessPolicy } from "./user-access";
import { SmartSpaceManagementPolicy } from "./smart-space-management";
import { SecurityPolicy } from "./security";
import { useShowQuickDisableSpaceManagement } from "./hooks/use-show-quick-disable-space-management";
import { useEditTeamPolicies } from "./hooks/use-edit-team-policies";
import { useTeamPolicies } from "./hooks/use-team-policies";
import { PoliciesRepackagePaywall } from "./paywall/policies-repackage-paywall";
import { useAdvancedPoliciesPermission } from "./paywall/use-advanced-policies-permision";
import { SharingPolicy } from "./sharing";
import { BrowserPolicy } from "./browser";
export interface Props {
  lee: Lee;
}
export const PoliciesSettings = ({ lee }: Props) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const showPaywallInfo = useBuyOrUpgradePaywallDetails(
    lee.permission.adminAccess
  );
  const restrictSharingPaywallDetails = useRestrictSharingPaywallDetails(
    lee.permission.adminAccess
  );
  const isTeamDiscontinuedAfterTrial = useIsTeamDiscontinuedAfterTrial();
  const showQuickDisableOfSmartSpaceManagement =
    useShowQuickDisableSpaceManagement();
  const { reportTACError } = useAlertQueue();
  const { data: policiesData, status } = useTeamPolicies();
  const editTeamPolicies = useEditTeamPolicies();
  const { hasExcludedPolicy, hasTrialBusinessPaywall } =
    useAdvancedPoliciesPermission();
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
  if (
    !showPaywallInfo ||
    !restrictSharingPaywallDetails ||
    isTeamDiscontinuedAfterTrial === null ||
    showQuickDisableOfSmartSpaceManagement === null
  ) {
    return <Loader />;
  }
  if (status === DataStatus.Error) {
    reportTACError(new Error("Error loading team policies"));
  }
  const hasPoliciesData = policiesData !== undefined && policiesData !== null;
  const isPersonalSpaceEnabledViaTeamSetting = hasPoliciesData
    ? policiesData.enablePersonalSpace
    : false;
  return (
    <SettingsPage
      title={translate("team_settings_menu_title_policies")}
      isLoading={status === DataStatus.Loading}
      sideContent={<PoliciesRepackagePaywall />}
    >
      {status === DataStatus.Success && policiesData ? (
        <>
          <UserAccessPolicy />

          {isPersonalSpaceEnabledViaTeamSetting ? (
            <SmartSpaceManagementPolicy
              checkForAuthenticationError={checkAuth}
              editSettings={editSettings}
              policies={policiesData}
              showQuickDisableOfSmartSpaceManagement={
                showQuickDisableOfSmartSpaceManagement
              }
            />
          ) : null}

          <SecurityPolicy
            checkForAuthenticationError={checkAuth}
            editSettings={editSettings}
            hasExcludedPolicy={hasExcludedPolicy}
            hasTrialBusinessPaywall={hasTrialBusinessPaywall}
            isPersonalSpaceEnabledViaTeamSetting={
              isPersonalSpaceEnabledViaTeamSetting
            }
            isTeamDiscontinuedAfterTrial={isTeamDiscontinuedAfterTrial}
            policies={policiesData}
            routes={routes}
            showPaywallInfo={showPaywallInfo}
          />

          <SharingPolicy
            checkForAuthenticationError={checkAuth}
            editSettings={editSettings}
            hasExcludedPolicy={hasExcludedPolicy}
            hasTrialBusinessPaywall={hasTrialBusinessPaywall}
            isTeamDiscontinuedAfterTrial={isTeamDiscontinuedAfterTrial}
            policies={policiesData}
            restrictSharingPaywallDetails={restrictSharingPaywallDetails}
            routes={routes}
          />

          <BrowserPolicy
            checkForAuthenticationError={checkAuth}
            editSettings={editSettings}
            hasExcludedPolicy={hasExcludedPolicy}
            hasTrialBusinessPaywall={hasTrialBusinessPaywall}
            isTeamDiscontinuedAfterTrial={isTeamDiscontinuedAfterTrial}
            policies={policiesData}
          />
        </>
      ) : null}
    </SettingsPage>
  );
};
