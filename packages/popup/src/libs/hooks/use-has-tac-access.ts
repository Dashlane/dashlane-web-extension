import { DataStatus } from '@dashlane/carbon-api-consumers';
import { permissionsApi } from '@dashlane/access-rights-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
import { useEffect, useState } from 'react';
import { isAccountBusiness } from 'src/app/helpers';
import { usePremiumStatusData } from 'src/libs/api';
import { PremiumStatus } from '@dashlane/communication';
const isAccountBusinessAdmin = (premiumStatus: PremiumStatus | null): boolean => {
    if (!premiumStatus || !isAccountBusiness(premiumStatus)) {
        return false;
    }
    return Boolean(premiumStatus.spaces?.some((space) => space.isTeamAdmin || space.isBillingAdmin));
};
export const useHasTacAccess = (): boolean => {
    const [hasTacPermissions, setHasTacPermissions] = useState<boolean>(false);
    const { data: permissions, status: permStatus } = useModuleQuery(permissionsApi, 'userPermissions');
    const premiumStatusQuery = usePremiumStatusData();
    const isBusinessAdmin = premiumStatusQuery.status === DataStatus.Success &&
        isAccountBusinessAdmin(premiumStatusQuery.data);
    useEffect(() => {
        if (permStatus === DataStatus.Success) {
            setHasTacPermissions(!!permissions.length);
        }
    }, [permStatus, permissions]);
    return isBusinessAdmin || hasTacPermissions;
};
