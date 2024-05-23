import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { NotAllowedReason, vaultAccessApi } from '@dashlane/session-contracts';
export const useGetSsoMigrationType = () => {
    const isAllowed = useModuleQuery(vaultAccessApi, 'isAllowed');
    return {
        status: isAllowed.status,
        data: isAllowed.status === DataStatus.Success &&
            !isAllowed.data.isAllowed &&
            (isAllowed.data.reasons.includes(NotAllowedReason.RequiresSSO2MPMigration) ||
                isAllowed.data.reasons.includes(NotAllowedReason.RequiresMP2SSOMigration))
            ? isAllowed.data.reasons
            : undefined,
    };
};
