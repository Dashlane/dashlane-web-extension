import { passwordHealthApi, PasswordHealthCounters, } from '@dashlane/password-security-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
export interface UsePasswordHealthState {
    counters: PasswordHealthCounters | undefined;
    isInitialized: boolean | undefined;
}
export const usePasswordHealthState = (spaceId: string | null): UsePasswordHealthState => {
    const { data } = useModuleQuery(passwordHealthApi, 'score', { spaceId });
    return {
        counters: data?.counters,
        isInitialized: data?.isInitialized,
    };
};
