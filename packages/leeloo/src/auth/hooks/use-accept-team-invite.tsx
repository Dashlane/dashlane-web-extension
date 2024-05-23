import queryString from 'query-string';
import { useEffect } from 'react';
import { LoginNotificationType } from '@dashlane/communication';
import TeamPlans from 'libs/api/TeamPlans';
import { useLocation } from 'libs/router';
import { carbonConnector } from 'libs/carbon/connector';
export const useAcceptTeamInvite = () => {
    const { search } = useLocation();
    const queryParams = queryString.parse(search);
    const inviteTokenQueryParam = queryParams.inviteToken ?? '';
    const handleAcceptTeamInvite = async (inviteToken: string) => {
        const response = await new TeamPlans().acceptTeam({ token: inviteToken });
        if (!response || response?.content?.error) {
            await carbonConnector.addLoginNotification({
                type: LoginNotificationType.TEAM_ACCEPTANCE_ERROR,
            });
        }
        else {
            await carbonConnector.addLoginNotification({
                type: LoginNotificationType.TEAM_ACCEPTANCE_SUCCESS,
            });
        }
    };
    useEffect(() => {
        if (inviteTokenQueryParam) {
            handleAcceptTeamInvite(inviteTokenQueryParam);
        }
    }, [inviteTokenQueryParam]);
};
