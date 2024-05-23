import { DataStatus } from '@dashlane/framework-react';
import { isAccountBusinessAdmin } from 'src/app/helpers';
import { usePremiumStatusData } from 'src/libs/api';
export const useIsBusinessAdmin = (): boolean => {
    const premiumStatusQuery = usePremiumStatusData();
    const isBusinessAdmin = premiumStatusQuery.status === DataStatus.Success &&
        isAccountBusinessAdmin(premiumStatusQuery.data);
    return isBusinessAdmin;
};
