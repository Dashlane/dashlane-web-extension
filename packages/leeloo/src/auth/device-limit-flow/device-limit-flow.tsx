import React from 'react';
import { useSelector } from 'react-redux';
import { assertUnreachable } from 'libs/assert-unreachable';
import { OneDeviceLimit } from '../one-device-limit';
import { InitialSyncProgress } from '../initial-sync-progress';
import { isInitialSyncAnimationIntroPhasePendingSelector } from '../initial-sync-progress/selectors';
import { LoginFlowLoader } from '../login-flow/login-flow-loader';
import { MultipleDevicesLimit } from 'auth/multiple-devices-limit/multiple-devices-limit';
import { LoginDeviceLimitFlowStage, LoginDeviceLimitFlowView, } from '@dashlane/communication';
export interface DeviceLimitFlowProps {
    stage: LoginDeviceLimitFlowView;
}
const DeviceLimitFlow = ({ stage }: DeviceLimitFlowProps) => {
    const [refreshedState, setRefreshState] = React.useState(false);
    const isInitialSyncAnimationIntroPhasePending = useSelector(isInitialSyncAnimationIntroPhasePendingSelector);
    if (stage.name === LoginDeviceLimitFlowStage.OneDeviceLimitReached &&
        isInitialSyncAnimationIntroPhasePending) {
        return <InitialSyncProgress stage={stage}/>;
    }
    if (!refreshedState &&
        stage.name === LoginDeviceLimitFlowStage.RefreshingDeviceLimitStatus) {
        setRefreshState(true);
    }
    switch (stage.name) {
        case LoginDeviceLimitFlowStage.UnlinkingAndOpeningSession:
        case LoginDeviceLimitFlowStage.DeviceLimitDone:
        case LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError:
            return <InitialSyncProgress stage={stage}/>;
        case LoginDeviceLimitFlowStage.RefreshingDeviceLimitStatus:
        case LoginDeviceLimitFlowStage.OpeningSessionAfterDeviceLimitRemoval:
            return <LoginFlowLoader />;
        case LoginDeviceLimitFlowStage.OneDeviceLimitReached:
            return <OneDeviceLimit previousDevice={stage.previousDevice}/>;
        case LoginDeviceLimitFlowStage.MultipleDevicesLimitReached:
            return (<MultipleDevicesLimit subscriptionCode={stage.subscriptionCode} devicesToDeactivate={stage.devicesToDeactivate} wasRefreshed={refreshedState}/>);
        default:
            return assertUnreachable(stage);
    }
};
export { DeviceLimitFlow };
