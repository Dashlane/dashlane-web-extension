import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
import { useIsMPlessUser } from 'webapp/account/security-settings/hooks/use-is-mpless-user';
import { useIsSSOUser } from 'webapp/account/security-settings/hooks/useIsSSOUser';
export function useAreProtectedItemsUnlocked(): boolean {
    const isSSOUser = useIsSSOUser();
    const isMPLessUser = useIsMPlessUser();
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.areProtectedItemsUnlocked,
        },
        liveConfig: {
            live: carbonConnector.liveAreProtectedItemsUnlocked,
        },
    }, []);
    return result.status === DataStatus.Success &&
        !isSSOUser &&
        !isMPLessUser.isMPLessUser
        ? !!result.data
        : true;
}
