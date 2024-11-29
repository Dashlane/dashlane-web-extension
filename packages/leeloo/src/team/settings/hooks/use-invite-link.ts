import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  inviteLinkApi,
  teamPlanDetailsApi,
} from "@dashlane/team-admin-contracts";
export type UseTeamInviteLink =
  | {
      status: DataStatus.Error | DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      teamKey: string;
      enabled: boolean;
      sendRequestInviteToken: (login: string) => Promise<void>;
      sendToggleInviteLink: (enabled: boolean) => Promise<void>;
    };
export const useInviteLinkDataGraphene = (): UseTeamInviteLink => {
  const { data: inviteData, status: inviteDataStatus } = useModuleQuery(
    inviteLinkApi,
    "inviteLinkData"
  );
  const { data: teamName, status: teamNameStatus } = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamName"
  );
  const { data: teamUuidResult, status: teamUuidResultStatus } = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamId"
  );
  const { requestUserInviteTokenSending } = useModuleCommands(inviteLinkApi);
  const { toggleInviteLink } = useModuleCommands(inviteLinkApi);
  if (
    inviteDataStatus === DataStatus.Error ||
    teamNameStatus === DataStatus.Error ||
    teamUuidResultStatus === DataStatus.Error ||
    teamUuidResult?.teamId === null ||
    inviteData === null
  ) {
    return {
      status: DataStatus.Error,
    };
  }
  if (
    inviteDataStatus === DataStatus.Loading ||
    teamNameStatus === DataStatus.Loading ||
    teamUuidResultStatus === DataStatus.Loading
  ) {
    return { status: DataStatus.Loading };
  }
  const teamUuid = teamUuidResult.teamId;
  const sendRequestInviteToken = async (login: string) => {
    try {
      await requestUserInviteTokenSending({
        login,
        teamUuid,
      });
    } catch (error) {
      throw new Error(
        `sendRequestInviteToken fetchData: failed with error: ${error}`
      );
    }
  };
  const sendToggleInviteLink = async (enabled: boolean) => {
    try {
      await toggleInviteLink({ enabled, teamName });
    } catch (error) {
      throw new Error(
        `sendToggleInviteLink fetchData: failed with error: ${error}`
      );
    }
  };
  return {
    status: inviteDataStatus,
    teamKey: inviteData.teamKey,
    enabled: inviteData.enabled,
    sendRequestInviteToken,
    sendToggleInviteLink,
  };
};
