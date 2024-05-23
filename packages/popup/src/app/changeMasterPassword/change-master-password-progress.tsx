import * as React from 'react';
import { CarbonLiveResult, LiveDataStatus, } from '@dashlane/carbon-api-consumers';
import { ChangeMasterPasswordStepNeeded, ChangeMasterPasswordProgress as ChangeMPProgress, } from '@dashlane/communication';
import { ChangeMasterPasswordLoading } from './change-master-password-loading';
import { ChangeMasterPasswordFailure } from './change-master-password-failure';
import { ChangeMasterPasswordSuccess } from './change-master-password-success';
enum ChangeMPProgressStatus {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE'
}
interface Props {
    changeMPProgress: CarbonLiveResult<ChangeMPProgress>;
    onOpenUserVault: () => void;
}
export const ChangeMasterPasswordProgress = ({ changeMPProgress, onOpenUserVault, }: Props) => {
    const [status, setStatus] = React.useState<ChangeMPProgressStatus>(ChangeMPProgressStatus.LOADING);
    const [progressValue, setProgressValue] = React.useState(0);
    React.useEffect(() => {
        if (changeMPProgress.status !== LiveDataStatus.Received) {
            return;
        }
        const { type, value } = changeMPProgress.data;
        if (type === ChangeMasterPasswordStepNeeded.DONE) {
            setStatus(ChangeMPProgressStatus.SUCCESS);
        }
        if (type === ChangeMasterPasswordStepNeeded.ERROR) {
            setStatus(ChangeMPProgressStatus.FAILURE);
        }
        setProgressValue(value);
    }, [changeMPProgress]);
    const handleOpenUserVault = (): void => {
        onOpenUserVault();
    };
    switch (status) {
        case ChangeMPProgressStatus.FAILURE: {
            return <ChangeMasterPasswordFailure onDone={handleOpenUserVault}/>;
        }
        case ChangeMPProgressStatus.SUCCESS: {
            return <ChangeMasterPasswordSuccess onDone={handleOpenUserVault}/>;
        }
        case ChangeMPProgressStatus.LOADING:
        default: {
            return <ChangeMasterPasswordLoading progressValue={progressValue}/>;
        }
    }
};
