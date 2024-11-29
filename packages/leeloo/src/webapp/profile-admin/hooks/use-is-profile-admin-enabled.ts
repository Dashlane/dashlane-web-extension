import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { AvailableFeatureFlips } from "@dashlane/onboarding-contracts";
import { useNodePremiumStatus } from "../../../libs/carbon/hooks/useNodePremiumStatus";
import { useIsTeamCreator } from "../../../team/hooks/use-is-team-creator";
import { useTeamCreationDate } from "../../../team/hooks/use-team-creation-date-unix";
export type UseIsProfileAdminEnabled =
  | {
      status: DataStatus.Error;
    }
  | {
      status: DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      isProfileAdminEnabled: boolean;
    };
const MAX_CREATION_AGE_IN_SECONDS = 3600 * 24 * 30;
export const useIsProfileAdminEnabled = (): UseIsProfileAdminEnabled => {
  const isProfileNewUsersFF = useFeatureFlip(
    AvailableFeatureFlips.OnboardingWebProfileNewUsers
  );
  const teamCreationDateData = useTeamCreationDate();
  const nodePremiumStatus = useNodePremiumStatus();
  const isTeamCreatorData = useIsTeamCreator();
  const { status: teamCreationDateDataStatus } = teamCreationDateData;
  const { status: nodePremiumStatusStatus } = nodePremiumStatus;
  const { status: isTeamCreatorDataStatus } = isTeamCreatorData;
  if (
    teamCreationDateDataStatus === DataStatus.Error ||
    nodePremiumStatusStatus === DataStatus.Error ||
    isTeamCreatorDataStatus === DataStatus.Error ||
    isProfileNewUsersFF === undefined
  ) {
    return { status: DataStatus.Error };
  }
  if (
    teamCreationDateDataStatus === DataStatus.Loading ||
    nodePremiumStatusStatus === DataStatus.Loading ||
    isTeamCreatorDataStatus === DataStatus.Loading ||
    isProfileNewUsersFF === null
  ) {
    return { status: DataStatus.Loading };
  }
  const currentUnixEpoch = Math.floor(Date.now() / 1000);
  const isTeamCreationWithin30Days =
    currentUnixEpoch - teamCreationDateData.teamCreationDate <
    MAX_CREATION_AGE_IN_SECONDS;
  const isAdminFromPaidTeamWithoutTrial =
    nodePremiumStatus.data.b2bStatus?.currentTeam?.hasBeenInTrial === false;
  const isInExtensionOrDesktop =
    APP_PACKAGED_IN_EXTENSION || APP_PACKAGED_IN_DESKTOP;
  const isProfileAdminEnabled =
    isTeamCreatorData.isTeamCreator &&
    isProfileNewUsersFF &&
    isTeamCreationWithin30Days &&
    isInExtensionOrDesktop &&
    isAdminFromPaidTeamWithoutTrial;
  return {
    status: DataStatus.Success,
    isProfileAdminEnabled,
  };
};
