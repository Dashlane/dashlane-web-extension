import { accountCreationApi } from "@dashlane/account-contracts";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
export type UseTeamInviteLink =
  | {
      status: DataStatus.Error | DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      teamKey: string;
      teamUuid: string;
      login: string;
      disabled: boolean;
      sendRequestUserInviteToken: (login: string) => void;
    };
export const useTeamSignupInviteLink = (
  teamKey: string | null
): UseTeamInviteLink => {
  const { data, status } = useModuleQuery(
    accountCreationApi,
    "inviteLinkData",
    {
      teamKey: teamKey === null ? "" : teamKey,
    }
  );
  const { requestTeamInviteTokenSending } =
    useModuleCommands(accountCreationApi);
  if (status !== DataStatus.Success) {
    return { status };
  }
  if (data === null) {
    return { status: DataStatus.Loading };
  }
  const sendRequestUserInviteToken = async (login: string) => {
    try {
      await requestTeamInviteTokenSending({ login, teamUuid: data.teamUuid });
    } catch (error) {
      throw new Error(
        `requestUserInviteTokenSending fetchData: failed with error: ${error}`
      );
    }
  };
  return {
    status,
    teamKey: data.teamKey,
    teamUuid: data.teamUuid,
    login: data.displayName,
    disabled: data.disabled,
    sendRequestUserInviteToken,
  };
};
