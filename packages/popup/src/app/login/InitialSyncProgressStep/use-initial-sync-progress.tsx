import React from "react";
import {
  DeviceLimitDoneStageView,
  LoginDeviceLimitFlowStage,
  UnlinkingAndOpeningSessionStageView,
} from "@dashlane/communication";
import {
  DeviceLimitFlowAnimationPhase,
  UseDeviceLimitFlowAnimationParams,
} from "../DeviceLimitFlow/use-device-limit-flow-animation";
export enum ProgressStep {
  UNLINKING_PREVIOUS_DEVICE = "UNLINKING_PREVIOUS_DEVICE",
  TRANSFERRING_DATA = "TRANSFERRING_DATA",
  STORING_DATA = "STORING_DATA",
}
export interface UseInitialSyncProgressProps {
  stage: DeviceLimitDoneStageView | UnlinkingAndOpeningSessionStageView;
  setIsInitialSyncAnimationPending: (value: boolean) => void;
}
export const useInitialSyncProgress = ({
  stage,
  setIsInitialSyncAnimationPending,
}: UseInitialSyncProgressProps): {
  animationProps: UseDeviceLimitFlowAnimationParams;
  step: ProgressStep;
} => {
  const [step, setStep] = React.useState<ProgressStep>(
    ProgressStep.UNLINKING_PREVIOUS_DEVICE
  );
  const initialSyncEndPromiseResolve = React.useRef<(() => void) | null>(null);
  const initialSyncEndPromise = React.useRef<Promise<void> | null>(null);
  const currentLoopFinishedResolve = React.useRef<(() => void) | null>(null);
  const notifyPendingState = (isPending: boolean) => () =>
    setIsInitialSyncAnimationPending(isPending);
  const waitForCurrentLoopToEnd = () => {
    return new Promise<void>((resolve) => {
      currentLoopFinishedResolve.current = resolve;
    });
  };
  const initInitialSyncEndPromise = () => {
    initialSyncEndPromise.current = new Promise<void>((resolve) => {
      initialSyncEndPromiseResolve.current = resolve;
    });
  };
  const waitForInitialSyncToEnd = () => {
    if (!initialSyncEndPromise.current) {
      throw new Error("Expected initial sync to be initiated");
    }
    return initialSyncEndPromise.current;
  };
  const onInitialSyncEnd = () => {
    if (
      stage.name === LoginDeviceLimitFlowStage.DeviceLimitDone &&
      typeof initialSyncEndPromiseResolve.current === "function"
    ) {
      initialSyncEndPromiseResolve.current();
    }
  };
  const onIntroStart = React.useCallback(() => {
    initInitialSyncEndPromise();
    setStep(ProgressStep.UNLINKING_PREVIOUS_DEVICE);
  }, []);
  const onIntroComplete = React.useCallback(
    (startPhase: (next: DeviceLimitFlowAnimationPhase) => void) =>
      startPhase(DeviceLimitFlowAnimationPhase.INNER_LOOP),
    []
  );
  const onInnerLoopStart = React.useCallback(
    (startPhase: (next: DeviceLimitFlowAnimationPhase) => void) => {
      waitForInitialSyncToEnd()
        .then(waitForCurrentLoopToEnd)
        .then(() => startPhase(DeviceLimitFlowAnimationPhase.OUTRO));
      setStep(ProgressStep.TRANSFERRING_DATA);
    },
    []
  );
  const onInnerLoopComplete = React.useCallback(
    () => currentLoopFinishedResolve.current?.(),
    []
  );
  const onOutroStart = React.useCallback(() => {
    setStep(ProgressStep.STORING_DATA);
  }, []);
  const onOutroComplete = React.useCallback(notifyPendingState(false), [
    setIsInitialSyncAnimationPending,
  ]);
  React.useEffect(notifyPendingState(true), [setIsInitialSyncAnimationPending]);
  React.useEffect(onInitialSyncEnd, [stage.name]);
  return {
    step,
    animationProps: {
      advanced: {
        onIntroStart,
        onIntroComplete,
        onInnerLoopStart,
        onInnerLoopComplete,
        onOutroStart,
        onOutroComplete,
      },
    },
  };
};
