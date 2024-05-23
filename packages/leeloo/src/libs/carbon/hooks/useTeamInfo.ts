import React from 'react';
import { getTeamInfo, TeamInfoResponseData, } from 'team/settings/team-settings-services';
interface UseTeamInfoOutput {
    isLoading: boolean;
    teamInfo: TeamInfoResponseData | undefined;
}
export function useTeamInfo(): UseTeamInfoOutput {
    const [teamInfo, setTeamInfo] = React.useState<TeamInfoResponseData>();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const getTeamInfoData = async () => {
        const teamInfoData = await getTeamInfo();
        setTeamInfo(teamInfoData);
        setIsLoading(false);
    };
    React.useEffect(() => {
        getTeamInfoData();
    }, []);
    return { isLoading, teamInfo };
}
