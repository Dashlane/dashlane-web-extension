import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { teamGetStartedApi } from '@dashlane/team-admin-contracts';
export type UseIsTeamCreator = {
    status: DataStatus.Error | DataStatus.Loading;
} | {
    status: DataStatus.Success;
    isTeamCreator: boolean;
};
export const useIsTeamCreator = (): UseIsTeamCreator => {
    const { data, status } = useModuleQuery(teamGetStartedApi, 'isTeamCreator');
    if (status !== DataStatus.Success) {
        return { status };
    }
    return {
        status,
        isTeamCreator: data,
    };
};
