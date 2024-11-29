import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useIsUserB2B } from "../../../libs/hooks/use-is-user-b2b";
import { useHasSharingRestrictedToTeam } from "./hooks/use-has-sharing-restricted-to-team";
import { SharingCenterEmptyStateForAdminWithTeamLimitedSharing } from "./components/sharing-center-empty-state-for-admin-with-team-limited-sharing";
import { CommonSharingCenterEmptyState } from "./components/common-sharing-center-empty-state";
import { useTeamId } from "../../../team/hooks/use-team-id";
export const SharingCenterEmptyState = () => {
  const teamId = useTeamId();
  const isUserB2B = useIsUserB2B();
  const hasRestrictedSharingPolicyEnabled = useHasSharingRestrictedToTeam();
  if (
    teamId.status !== DataStatus.Success ||
    isUserB2B.status !== DataStatus.Success ||
    hasRestrictedSharingPolicyEnabled.status !== DataStatus.Success
  ) {
    return null;
  }
  const isAdminWithTeamRestrictedSharingPolicyEnabled =
    isUserB2B.isB2B &&
    isUserB2B.b2bRoles.isAdmin &&
    hasRestrictedSharingPolicyEnabled.hasSharingRestrictedToTeam;
  if (isAdminWithTeamRestrictedSharingPolicyEnabled && teamId.teamId) {
    return (
      <SharingCenterEmptyStateForAdminWithTeamLimitedSharing
        teamId={teamId.teamId}
      />
    );
  }
  return <CommonSharingCenterEmptyState />;
};
