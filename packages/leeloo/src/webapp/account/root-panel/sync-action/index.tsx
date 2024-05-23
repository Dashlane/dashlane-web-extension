import * as React from 'react';
import { useModuleCommands } from '@dashlane/framework-react';
import { syncApi, SyncStatuses } from '@dashlane/sync-contracts';
import { Trigger } from '@dashlane/hermes';
import AsyncActionButton from '../async-action-button/async-action-button';
import { useSyncStatus } from 'webapp/account/hooks/use-sync-status';
export enum AnimationStatus {
    Error = 'error',
    Success = 'success',
    Loading = 'loading',
    Idle = 'idle'
}
const mapProgressStatus = (statusResult?: SyncStatuses): AnimationStatus => {
    switch (statusResult) {
        case SyncStatuses.FAILURE:
            return AnimationStatus.Error;
        case SyncStatuses.SUCCESS:
            return AnimationStatus.Success;
        case SyncStatuses.IN_PROGRESS:
            return AnimationStatus.Loading;
        default:
            return AnimationStatus.Idle;
    }
};
const SyncAction = ({ children }: {
    children: React.ReactNode;
}) => {
    const { sync } = useModuleCommands(syncApi);
    const { watchNextSync, status } = useSyncStatus();
    const handleManualSync = () => {
        watchNextSync();
        sync({ trigger: Trigger.Manual });
    };
    return (<AsyncActionButton status={mapProgressStatus(status)} onClick={handleManualSync}>
      {children}
    </AsyncActionButton>);
};
export default SyncAction;
