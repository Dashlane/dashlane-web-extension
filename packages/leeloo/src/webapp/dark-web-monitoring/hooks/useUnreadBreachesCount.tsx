import { breachesApi } from '@dashlane/password-security-contracts';
import { useCachedModuleQuery } from '@dashlane/framework-react';
export interface UseUnreadBreachesCount {
    count: number | null;
}
export const useUnreadBreachesCount = (): UseUnreadBreachesCount => {
    const { data } = useCachedModuleQuery(breachesApi, 'unreadBreachesCount');
    return {
        count: data?.count ?? null,
    };
};
