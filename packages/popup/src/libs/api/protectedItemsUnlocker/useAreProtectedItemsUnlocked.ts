import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { DataStatus } from 'libs/api/types';
import { carbonConnector } from 'src/carbonConnector';
import { useIsMPlessUser } from '../account/useIsMPLessAccount';
export function useAreProtectedItemsUnlocked(): boolean {
    const { isMPLessUser } = useIsMPlessUser();
    const AreProtectedItemsUnlockedResult = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.areProtectedItemsUnlocked,
        },
        liveConfig: {
            live: carbonConnector.liveAreProtectedItemsUnlocked,
        },
    }, []);
    return !isMPLessUser
        ? AreProtectedItemsUnlockedResult.status === DataStatus.Success &&
            AreProtectedItemsUnlockedResult.data
        : true;
}
