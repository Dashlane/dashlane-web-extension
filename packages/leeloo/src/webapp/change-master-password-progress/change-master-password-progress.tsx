import {
  ChangeMPProgressStatus,
  useChangeMasterPasswordProgress,
} from "./hooks/useChangeMasterPasswordProgress";
import { ChangeMasterPasswordFailure } from "./change-master-password-failure";
import { ChangeMasterPasswordLoading } from "./change-master-password-loading";
import { ChangeMasterPasswordSuccess } from "./change-master-password-success";
import styles from "./change-master-password-progress.css";
import { useHistory, useRouterGlobalSettingsContext } from "../../libs/router";
export const ChangeMasterPasswordProgress = () => {
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const { status, progressValue } = useChangeMasterPasswordProgress();
  const onClickClose = () => {
    return history.push(routes.reactivatePinAndArk);
  };
  if (status === ChangeMPProgressStatus.NOT_STARTED) {
    return null;
  }
  return (
    <div className={styles.fullPage}>
      {status === ChangeMPProgressStatus.LOADING ? (
        <ChangeMasterPasswordLoading progressValue={progressValue} />
      ) : null}
      {status === ChangeMPProgressStatus.FAILURE ? (
        <ChangeMasterPasswordFailure
          progressValue={progressValue}
          onBack={onClickClose}
        />
      ) : null}
      {status === ChangeMPProgressStatus.SUCCESS ? (
        <ChangeMasterPasswordSuccess
          progressValue={progressValue}
          onDone={onClickClose}
        />
      ) : null}
    </div>
  );
};
