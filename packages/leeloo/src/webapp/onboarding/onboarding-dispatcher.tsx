import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { AvailableFeatureFlips } from "@dashlane/onboarding-contracts";
import { Lee } from "../../lee";
import { Redirect, useRouterGlobalSettingsContext } from "../../libs/router";
import { Loader } from "../../team/components/loader";
import { useIsTeamCreator } from "../../team/hooks/use-is-team-creator";
import { useTeamId } from "../../team/hooks/use-team-id";
import { useShouldDisplayAdminVaultGetStartedGuide } from "../../team/settings/hooks/use-display-admin-vault-getstarted";
import { OnboardingSteps } from "./onboarding-steps/onboarding-steps";
import { GetStarted } from "./get-started/get-started";
import { GuideUserType } from "./get-started/types/user.types";
import { useProfileAdmin } from "../profile-admin/hooks/use-profile-admin";
const getGuideUserType = (
  hasTeam: boolean,
  isTeamCreator: boolean
): GuideUserType => {
  if (hasTeam) {
    return isTeamCreator ? GuideUserType.TEAM_CREATOR : GuideUserType.EMPLOYEE;
  }
  return GuideUserType.B2C;
};
export const OnboardingDispatcher = ({ lee }: { lee: Lee }) => {
  const isTeamCreator = useIsTeamCreator();
  const teamId = useTeamId();
  const profileAdminData = useProfileAdmin();
  const shouldDisplayAdminGuide = useShouldDisplayAdminVaultGetStartedGuide();
  const hasB2CGuideFF = useFeatureFlip(
    AvailableFeatureFlips.SaexOnboardingHubAddPasswords
  );
  const {
    routes: { clientRoutesBasePath, userProfileAdmin },
  } = useRouterGlobalSettingsContext();
  if (
    shouldDisplayAdminGuide.status !== DataStatus.Success ||
    hasB2CGuideFF === null ||
    isTeamCreator.status === DataStatus.Loading ||
    teamId.status === DataStatus.Loading ||
    profileAdminData.status === DataStatus.Loading
  ) {
    return <Loader />;
  }
  const shouldRedirectToProfileAdmin =
    profileAdminData.status === DataStatus.Success &&
    profileAdminData.shouldRedirectToProfiling;
  if (shouldRedirectToProfileAdmin) {
    profileAdminData.markProfilingFormSeen();
    return <Redirect to={userProfileAdmin} />;
  }
  const isNotTeamCreator =
    isTeamCreator.status === DataStatus.Success && !isTeamCreator.isTeamCreator;
  const hasTeam =
    teamId.status === DataStatus.Success && teamId.teamId !== null;
  const guideUserType = getGuideUserType(hasTeam, !isNotTeamCreator);
  const shouldDisplayUserGuide =
    isNotTeamCreator && hasB2CGuideFF && APP_PACKAGED_IN_EXTENSION;
  if (
    !shouldDisplayAdminGuide.shouldDisplayAdminVaultGetStartedGuide &&
    !shouldDisplayUserGuide
  ) {
    return <Redirect to={clientRoutesBasePath} />;
  }
  return shouldDisplayAdminGuide.shouldDisplayAdminVaultGetStartedGuide ? (
    <GetStarted userType={guideUserType} />
  ) : (
    <OnboardingSteps lee={lee} />
  );
};
