import React from "react";
import { Animation, AnimationParams } from "../../../components/animation";
import { assertUnreachable } from "../../../libs/assert-unreachable";
import {
  DeviceLimitFlowAnimationPhase,
  useDeviceLimitFlowAnimation,
  UseDeviceLimitFlowAnimationParams,
} from "./use-device-limit-flow-animation";
const DEFAULT_ANIMATION_OPTIONS: Partial<AnimationParams> = {
  autoplay: true,
  renderer: "svg",
  rendererSettings: {
    preserveAspectRatio: "xMidYMid",
    viewBoxOnly: true,
  },
};
const ANIMATION_LOOP_CONFIG = {
  [DeviceLimitFlowAnimationPhase.INTRO]: false,
  [DeviceLimitFlowAnimationPhase.INNER_LOOP]: true,
  [DeviceLimitFlowAnimationPhase.OUTRO]: false,
};
const ANIMATION_DATA = {} as Record<
  DeviceLimitFlowAnimationPhase,
  AnimationParams
>;
const loadAnimationPhaseData = async (phase: DeviceLimitFlowAnimationPhase) => {
  const animationData = await import(`./assets/${phase}_animation.json`);
  ANIMATION_DATA[phase] = {
    ...DEFAULT_ANIMATION_OPTIONS,
    animationData,
    loop: ANIMATION_LOOP_CONFIG[phase],
  };
};
let isAnimationDataLoaded = false;
const loadAnimationData = async () => {
  if (isAnimationDataLoaded) {
    return;
  }
  await Promise.all(
    [
      DeviceLimitFlowAnimationPhase.INTRO,
      DeviceLimitFlowAnimationPhase.INNER_LOOP,
      DeviceLimitFlowAnimationPhase.OUTRO,
    ].map(loadAnimationPhaseData)
  );
  isAnimationDataLoaded = true;
};
const Placeholder = ({ className }: { className: string }) => (
  <div className={className} />
);
export interface DeviceLimitFlowAnimationProps
  extends UseDeviceLimitFlowAnimationParams {
  containerClassName: string;
}
export const DeviceLimitFlowAnimation = ({
  containerClassName,
  ...rest
}: DeviceLimitFlowAnimationProps) => {
  const { onIntroComplete, onInnerLoopComplete, onOutroComplete, phase } =
    useDeviceLimitFlowAnimation(rest);
  const introEventListeners = React.useMemo(
    () => [
      {
        eventName: "complete" as const,
        callback: onIntroComplete,
      },
    ],
    [onIntroComplete]
  );
  const innerLoopEventListeners = React.useMemo(
    () => [
      {
        eventName: "loopComplete" as const,
        callback: onInnerLoopComplete,
      },
    ],
    [onInnerLoopComplete]
  );
  const outroEventListeners = React.useMemo(
    () => [
      {
        eventName: "complete" as const,
        callback: onOutroComplete,
      },
    ],
    [onOutroComplete]
  );
  const [isDataLoaded, setIsDataLoaded] = React.useState(isAnimationDataLoaded);
  React.useEffect(() => {
    loadAnimationData().then(() => {
      setIsDataLoaded(true);
    });
  }, []);
  if (!isDataLoaded) {
    return <Placeholder className={containerClassName} />;
  }
  switch (phase) {
    case DeviceLimitFlowAnimationPhase.INTRO:
      return (
        <Animation
          animationParams={ANIMATION_DATA[DeviceLimitFlowAnimationPhase.INTRO]}
          containerClassName={containerClassName}
          eventListeners={introEventListeners}
          loadingComp={<Placeholder className={containerClassName} />}
        />
      );
    case DeviceLimitFlowAnimationPhase.INNER_LOOP:
      return (
        <Animation
          animationParams={
            ANIMATION_DATA[DeviceLimitFlowAnimationPhase.INNER_LOOP]
          }
          containerClassName={containerClassName}
          eventListeners={innerLoopEventListeners}
          loadingComp={<Placeholder className={containerClassName} />}
        />
      );
    case DeviceLimitFlowAnimationPhase.OUTRO:
      return (
        <Animation
          animationParams={ANIMATION_DATA[DeviceLimitFlowAnimationPhase.OUTRO]}
          containerClassName={containerClassName}
          eventListeners={outroEventListeners}
          loadingComp={<Placeholder className={containerClassName} />}
        />
      );
    default:
      assertUnreachable(phase);
  }
};
