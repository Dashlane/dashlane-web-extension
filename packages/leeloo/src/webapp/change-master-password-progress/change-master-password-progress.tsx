import React from 'react';
import { ChangeMPProgressStatus, useChangeMasterPasswordProgress, } from './hooks/useChangeMasterPasswordProgress';
import { ChangeMasterPasswordFailure } from './change-master-password-failure';
import { ChangeMasterPasswordLoading } from './change-master-password-loading';
import { ChangeMasterPasswordSuccess } from './change-master-password-success';
import styles from './change-master-password-progress.css';
interface Props {
    onOpenUserVault: () => void;
}
export const ChangeMasterPasswordProgress = ({ onOpenUserVault }: Props) => {
    const { status, progressValue } = useChangeMasterPasswordProgress();
    const handleOpenUserVault = (): void => {
        onOpenUserVault();
    };
    if (status === ChangeMPProgressStatus.NOT_STARTED) {
        return null;
    }
    return (<div className={styles.fullPage}>
      {status === ChangeMPProgressStatus.LOADING ? (<ChangeMasterPasswordLoading progressValue={progressValue}/>) : null}
      {status === ChangeMPProgressStatus.FAILURE ? (<ChangeMasterPasswordFailure progressValue={progressValue} onBack={handleOpenUserVault}/>) : null}
      {status === ChangeMPProgressStatus.SUCCESS ? (<ChangeMasterPasswordSuccess progressValue={progressValue} onDone={handleOpenUserVault}/>) : null}
    </div>);
};
