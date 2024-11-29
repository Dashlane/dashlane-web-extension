import { useEffect, useState } from "react";
import { carbonConnector } from "../../../libs/carbon/connector";
import {
  CarbonLifecycleEvent,
  LiveDataStatus,
  useCarbonLifecycleEvents,
  useCarbonLive,
} from "@dashlane/carbon-api-consumers";
import { ChangeMasterPasswordStepNeeded } from "@dashlane/communication";
export enum ChangeMPProgressStatus {
  NOT_STARTED = "NOT_STARTED",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
export interface ChangeMPProgress {
  status: ChangeMPProgressStatus;
  progressValue: number;
}
export function useChangeMasterPasswordProgress(): ChangeMPProgress {
  const [status, setStatus] = useState<ChangeMPProgressStatus>(
    ChangeMPProgressStatus.NOT_STARTED
  );
  const [progressValue, setProgressValue] = useState(0);
  useCarbonLifecycleEvents(
    (event: CarbonLifecycleEvent) => {
      if (
        event === CarbonLifecycleEvent.KILLED &&
        ![
          ChangeMPProgressStatus.SUCCESS,
          ChangeMPProgressStatus.NOT_STARTED,
        ].includes(status)
      ) {
        setStatus(ChangeMPProgressStatus.FAILURE);
      }
    },
    [status]
  );
  const changeMPProgress = useCarbonLive(
    {
      live: carbonConnector.liveChangeMasterPasswordStatus,
    },
    []
  );
  useEffect(() => {
    if (
      changeMPProgress.status !== LiveDataStatus.Received ||
      !changeMPProgress.data
    ) {
      return;
    }
    const { type, value } = changeMPProgress.data;
    if (type === ChangeMasterPasswordStepNeeded.DONE) {
      setStatus(ChangeMPProgressStatus.SUCCESS);
    } else if (type === ChangeMasterPasswordStepNeeded.ERROR) {
      setStatus(ChangeMPProgressStatus.FAILURE);
    } else {
      setStatus(ChangeMPProgressStatus.LOADING);
    }
    setProgressValue(value);
  }, [changeMPProgress]);
  return { status, progressValue };
}
