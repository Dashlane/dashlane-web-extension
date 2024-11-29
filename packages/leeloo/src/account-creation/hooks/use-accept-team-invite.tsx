import queryString from "query-string";
import { useEffect, useState } from "react";
import { useToast } from "@dashlane/design-system";
import TeamPlans from "../../libs/api/TeamPlans";
import useTranslate from "../../libs/i18n/useTranslate";
import { useLocation } from "../../libs/router";
export type UseAcceptTeamInvite = {
  isAcceptTeamInviteCheckDone: boolean;
};
const I18N_KEYS = {
  ACCEPT_TEAM_INVITE_ERROR:
    "standalone_account_creation_error_invite_link_acceptance_failed",
  ACCEPT_TEAM_INVITE_SUCCESS:
    "standalone_account_creation_error_invite_link_acceptance_success",
};
export const useAcceptTeamInvite = (): UseAcceptTeamInvite => {
  const [isAcceptTeamInviteCheckDone, setIsAcceptTeamInviteCheckDone] =
    useState(false);
  const { search } = useLocation();
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const queryParams = queryString.parse(search);
  const inviteTokenQueryParam = queryParams.inviteToken ?? "";
  const handleAcceptTeamInvite = async (inviteToken: string) => {
    let isResponseError = false;
    await new TeamPlans().acceptTeam({ token: inviteToken }).catch(() => {
      isResponseError = true;
    });
    if (isResponseError) {
      showToast({
        description: translate(I18N_KEYS.ACCEPT_TEAM_INVITE_ERROR),
        mood: "danger",
      });
    } else {
      setIsAcceptTeamInviteCheckDone(true);
      showToast({
        description: translate(I18N_KEYS.ACCEPT_TEAM_INVITE_SUCCESS),
      });
    }
  };
  useEffect(() => {
    if (inviteTokenQueryParam) {
      handleAcceptTeamInvite(inviteTokenQueryParam);
    } else {
      setIsAcceptTeamInviteCheckDone(true);
    }
  }, [inviteTokenQueryParam]);
  return {
    isAcceptTeamInviteCheckDone,
  };
};
