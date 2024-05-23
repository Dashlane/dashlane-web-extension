import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { teamGetStartedApi } from '@dashlane/team-admin-contracts';
export interface UseHasVisitedVault {
    status: DataStatus;
    hasVisitedVault: boolean | null;
    markVaultAsVisited: () => void;
}
export const useHasVisitedVault = (): UseHasVisitedVault => {
    const { data, status } = useModuleQuery(teamGetStartedApi, 'hasVisitedVault');
    const { markVaultAsVisited } = useModuleCommands(teamGetStartedApi);
    return {
        status,
        hasVisitedVault: status === DataStatus.Success ? data : null,
        markVaultAsVisited: () => {
            markVaultAsVisited(undefined);
        },
    };
};
