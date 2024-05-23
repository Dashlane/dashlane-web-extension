import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { teamGetStartedApi } from '@dashlane/team-admin-contracts';
export interface UseHasSeenGetStarted {
    isHasSeenGetStartedLoading: boolean;
    hasSeenGetStarted: boolean;
    markGetStartedAsSeen: () => void;
}
export const useHasSeenGetStarted = (): UseHasSeenGetStarted => {
    const { data, status } = useModuleQuery(teamGetStartedApi, 'hasSeenGetStarted');
    const { markGetStartedAsSeen } = useModuleCommands(teamGetStartedApi);
    return {
        isHasSeenGetStartedLoading: status === DataStatus.Loading,
        hasSeenGetStarted: status === DataStatus.Success ? data : false,
        markGetStartedAsSeen: () => {
            markGetStartedAsSeen(undefined);
        },
    };
};
