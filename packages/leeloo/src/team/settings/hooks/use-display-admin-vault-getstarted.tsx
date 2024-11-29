import { DataStatus } from "@dashlane/framework-react";
import { useIsTeamCreator } from "../../hooks/use-is-team-creator";
import { useTeamCreationDate } from "../../hooks/use-team-creation-date-unix";
import { useHasDismissedGetStarted } from "../../../webapp/onboarding/get-started/hooks/use-get-started-dismissed";
const TEAM_CREATION_DATE_LIMIT = 1702508400;
export type UseShouldDisplayAdminVaultGetStartedGuide =
  | {
      status: DataStatus.Error | DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      shouldDisplayAdminVaultGetStartedGuide: boolean;
    };
export const useShouldDisplayAdminVaultGetStartedGuide =
  (): UseShouldDisplayAdminVaultGetStartedGuide => {
    const hasDismissedGetStarted = useHasDismissedGetStarted();
    const teamCreationDate = useTeamCreationDate();
    const isTeamCreator = useIsTeamCreator();
    if (
      hasDismissedGetStarted.status === DataStatus.Error ||
      teamCreationDate.status === DataStatus.Error ||
      isTeamCreator.status === DataStatus.Error
    ) {
      return {
        status: DataStatus.Success,
        shouldDisplayAdminVaultGetStartedGuide: false,
      };
    }
    if (
      hasDismissedGetStarted.status !== DataStatus.Success ||
      teamCreationDate.status !== DataStatus.Success ||
      isTeamCreator.status !== DataStatus.Success
    ) {
      return { status: DataStatus.Loading };
    }
    const shouldDisplayAdminVaultGetStartedGuide =
      !hasDismissedGetStarted.isGetStartedDismissed &&
      teamCreationDate.teamCreationDate >= TEAM_CREATION_DATE_LIMIT &&
      (isTeamCreator.isTeamCreator ?? false);
    return {
      status: DataStatus.Success,
      shouldDisplayAdminVaultGetStartedGuide,
    };
  };
