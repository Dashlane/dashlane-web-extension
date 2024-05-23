import { antiphishingApi, IsAutoRedirectedDomainQuery, } from '@dashlane/password-security-contracts';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import { HookResultOf } from '@dashlane/framework-react/src/hooks/types-queries';
export interface UseAntiphishing {
    isAutoRedirected: HookResultOf<typeof IsAutoRedirectedDomainQuery>;
    addToAutoRedirectedDomain: () => Promise<void>;
}
export const useAntiphishing = (domain: string | null): UseAntiphishing => {
    const { addAutoRedirectedDomain } = useModuleCommands(antiphishingApi);
    return {
        isAutoRedirected: useModuleQuery(antiphishingApi, 'isAutoRedirectedDomain', {
            domain,
        }),
        addToAutoRedirectedDomain: async () => {
            await addAutoRedirectedDomain({ domain });
        },
    };
};
