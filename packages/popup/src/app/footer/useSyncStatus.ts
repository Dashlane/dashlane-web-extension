import * as React from 'react';
import { useModuleQuery } from '@dashlane/framework-react';
import { syncApi } from '@dashlane/sync-contracts';
import { CarbonLifecycleEvent, DataStatus, useCarbonLifecycleEvents, } from '@dashlane/carbon-api-consumers';
import { SyncStatuses } from '@dashlane/communication';
export const useSyncStatus = () => {
    const listening = React.useRef(false);
    const syncInfo = useModuleQuery(syncApi, 'syncProgress');
    const [status, setStatus] = React.useState<SyncStatuses>();
    useCarbonLifecycleEvents((event: CarbonLifecycleEvent) => {
        if (event === CarbonLifecycleEvent.KILLED && listening.current) {
            setStatus(SyncStatuses.FAILURE);
        }
    }, [status]);
    const watchNextSync = () => {
        listening.current = true;
    };
    React.useEffect(() => {
        if (listening.current && syncInfo.status === DataStatus.Success) {
            if ([SyncStatuses.SUCCESS, SyncStatuses.FAILURE].includes(syncInfo.data.status)) {
                listening.current = false;
            }
            setStatus(syncInfo.data.status);
        }
    }, [syncInfo]);
    return {
        watchNextSync,
        status,
    };
};
