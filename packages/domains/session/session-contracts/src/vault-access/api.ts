import { defineModuleApi } from '@dashlane/framework-contracts';
import { IsAllowedQuery } from './queries/is-allowed.query';
import { DeviceLimitQuery } from './queries';
export const vaultAccessApi = defineModuleApi({
    name: 'vaultAccess' as const,
    commands: {},
    events: {},
    queries: {
        isAllowed: IsAllowedQuery,
        deviceLimit: DeviceLimitQuery,
    },
});
