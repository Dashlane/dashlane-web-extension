import * as React from 'react';
export enum DeviceLimitFlowAnimationPhase {
    INTRO = 'INTRO',
    INNER_LOOP = 'INNER_LOOP',
    OUTRO = 'OUTRO'
}
export type DeviceLimitFlowAnimationCallback = (setPhase: (next: DeviceLimitFlowAnimationPhase) => void) => void;
export interface UseDeviceLimitFlowAnimationParams {
    loop?: boolean;
    advanced?: {
        onIntroStart?: DeviceLimitFlowAnimationCallback;
        onIntroComplete?: DeviceLimitFlowAnimationCallback;
        onInnerLoopStart?: DeviceLimitFlowAnimationCallback;
        onInnerLoopComplete?: DeviceLimitFlowAnimationCallback;
        onOutroStart?: DeviceLimitFlowAnimationCallback;
        onOutroComplete?: DeviceLimitFlowAnimationCallback;
    };
}
export const useDeviceLimitFlowAnimation = ({ loop, advanced, }: UseDeviceLimitFlowAnimationParams) => {
    const [phase, startPhase] = React.useState<DeviceLimitFlowAnimationPhase>(DeviceLimitFlowAnimationPhase.INTRO);
    const onIntroComplete = React.useCallback(() => {
        startPhase(DeviceLimitFlowAnimationPhase.INNER_LOOP);
    }, []);
    const onInnerLoopComplete = React.useCallback(() => {
        startPhase(DeviceLimitFlowAnimationPhase.OUTRO);
    }, []);
    const onOutroComplete = React.useCallback(() => {
        if (loop) {
            startPhase(DeviceLimitFlowAnimationPhase.INTRO);
        }
    }, [loop]);
    const onIntroCompleteAdvanced = React.useCallback(() => {
        return advanced?.onIntroComplete?.(startPhase);
    }, [advanced?.onIntroComplete]);
    const onInnerLoopCompleteAdvanced = React.useCallback(() => {
        return advanced?.onInnerLoopComplete?.(startPhase);
    }, [advanced?.onInnerLoopComplete]);
    const onOutroCompleteAdvanced = React.useCallback(() => {
        return advanced?.onOutroComplete?.(startPhase);
    }, [advanced?.onOutroComplete]);
    React.useEffect(() => {
        switch (phase) {
            case DeviceLimitFlowAnimationPhase.INTRO: {
                advanced?.onIntroStart?.(startPhase);
                break;
            }
            case DeviceLimitFlowAnimationPhase.INNER_LOOP: {
                advanced?.onInnerLoopStart?.(startPhase);
                break;
            }
            case DeviceLimitFlowAnimationPhase.OUTRO: {
                advanced?.onOutroStart?.(startPhase);
                break;
            }
        }
    }, [
        phase,
        advanced?.onIntroStart,
        advanced?.onInnerLoopStart,
        advanced?.onOutroStart,
    ]);
    return {
        phase,
        onIntroComplete: advanced ? onIntroCompleteAdvanced : onIntroComplete,
        onInnerLoopComplete: advanced
            ? onInnerLoopCompleteAdvanced
            : onInnerLoopComplete,
        onOutroComplete: advanced ? onOutroCompleteAdvanced : onOutroComplete,
    };
};
