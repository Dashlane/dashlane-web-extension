import React from 'react';
import { useDispatch } from 'react-redux';
import { DeviceLimitFlowAnimationPhase, UseDeviceLimitFlowAnimationParams, } from '../device-limit-flow/use-device-limit-flow-animation';
import { setIsInitialSyncAnimationIntroPending, setIsInitialSyncAnimationPending, } from './actions';
import { LoginDeviceLimitFlowStage, LoginDeviceLimitFlowView, } from '@dashlane/communication';
export enum ProgressStep {
    UNLINKING_PREVIOUS_DEVICE = 'UNLINKING_PREVIOUS_DEVICE',
    TRANSFERRING_DATA = 'TRANSFERRING_DATA',
    STORING_DATA = 'STORING_DATA'
}
export interface UseInitialSyncProgressProps {
    stage: LoginDeviceLimitFlowView;
}
export const useInitialSyncProgress = ({ stage, }: UseInitialSyncProgressProps): {
    animationProps: UseDeviceLimitFlowAnimationParams;
    step: ProgressStep;
} => {
    const dispatch = useDispatch();
    const [step, setStep] = React.useState<ProgressStep>(ProgressStep.UNLINKING_PREVIOUS_DEVICE);
    const initialSyncEndPromiseResolve = React.useRef<(() => void) | null>(null);
    const initialSyncEndPromise = React.useRef<Promise<void> | null>(null);
    const currentLoopFinishedResolve = React.useRef<(() => void) | null>(null);
    const notifyPendingState = (isPending: boolean) => () => {
        dispatch(setIsInitialSyncAnimationPending(isPending));
    };
    const setIsIntroPhasePending = (isPending: boolean) => {
        dispatch(setIsInitialSyncAnimationIntroPending(isPending));
    };
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
            throw new Error('Expected initial sync to be initiated');
        }
        return initialSyncEndPromise.current;
    };
    const onInitialSyncEnd = () => {
        if (stage?.name === LoginDeviceLimitFlowStage.DeviceLimitDone &&
            typeof initialSyncEndPromiseResolve.current === 'function') {
            initialSyncEndPromiseResolve.current();
        }
    };
    const onIntroStart = React.useCallback(() => {
        initInitialSyncEndPromise();
        setStep(ProgressStep.UNLINKING_PREVIOUS_DEVICE);
        setIsIntroPhasePending(true);
    }, []);
    const onIntroComplete = React.useCallback((startPhase: (next: DeviceLimitFlowAnimationPhase) => void) => {
        setIsIntroPhasePending(false);
        startPhase(DeviceLimitFlowAnimationPhase.INNER_LOOP);
    }, []);
    const onInnerLoopStart = React.useCallback((startPhase: (next: DeviceLimitFlowAnimationPhase) => void) => {
        waitForInitialSyncToEnd()
            .then(waitForCurrentLoopToEnd)
            .then(() => startPhase(DeviceLimitFlowAnimationPhase.OUTRO));
        setStep(ProgressStep.TRANSFERRING_DATA);
    }, []);
    const onInnerLoopComplete = React.useCallback(() => currentLoopFinishedResolve.current?.(), []);
    const onOutroStart = React.useCallback(() => {
        setStep(ProgressStep.STORING_DATA);
    }, []);
    const onOutroComplete = React.useCallback(notifyPendingState(false), []);
    React.useEffect(notifyPendingState(true), []);
    React.useEffect(onInitialSyncEnd, [stage?.name]);
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
