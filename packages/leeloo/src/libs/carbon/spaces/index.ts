import { AdminData, Space } from '@dashlane/communication';
import { selectTeamAdminData } from 'libs/carbon/teamAdminData/selectors';
import { GlobalState } from 'store/types';
import { is } from 'ramda';
export const getCurrentSpace = (globalState: GlobalState): Space | undefined => globalState.carbon.spaceData.spaces.find((space) => space.details.status === 'accepted');
export const getCurrentTeamId = (globalState: GlobalState): number | null => {
    const space = getCurrentSpace(globalState);
    return space && is(String, space.teamId) ? Number(space.teamId) : null;
};
export const getCurrentTeam = (globalState: GlobalState): AdminData | undefined => {
    const teamId = getCurrentTeamId(globalState);
    return (teamId && selectTeamAdminData(globalState)[teamId]) ?? undefined;
};
