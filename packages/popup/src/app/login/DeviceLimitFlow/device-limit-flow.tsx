import React from "react";
import { LoginDeviceLimitFlowStage } from "@dashlane/communication";
import { assertUnreachable } from "../../../libs/assert-unreachable";
import { OneDeviceLimitStep } from "../OneDeviceLimitStep";
import { InitialSyncProgressStep } from "../InitialSyncProgressStep";
import { useLoginDeviceLimitFlow } from "./use-device-limit-flow";
import { LoginFlowLoader } from "../LoginFlowLoader/login-flow-loader";
import { MultipleDevicesLimitStep } from "../MultipleDevicesLimitStep/multiple-devices-limit-step";
export interface DeviceLimitFlowProps {
  setIsInitialSyncAnimationPending: (pending: boolean) => void;
  onStartOver: () => void;
}
const DeviceLimitFlow = ({
  setIsInitialSyncAnimationPending,
  onStartOver,
}: DeviceLimitFlowProps) => {
  const stage = useLoginDeviceLimitFlow();
  if (!stage) {
    return null;
  }
  switch (stage.name) {
    case LoginDeviceLimitFlowStage.RefreshingDeviceLimitStatus:
    case LoginDeviceLimitFlowStage.OpeningSessionAfterDeviceLimitRemoval:
      return <LoginFlowLoader />;
    case LoginDeviceLimitFlowStage.OneDeviceLimitReached:
      return (
        <OneDeviceLimitStep
          previousDevice={stage.previousDevice}
          onStartOver={onStartOver}
        />
      );
    case LoginDeviceLimitFlowStage.MultipleDevicesLimitReached:
      return (
        <MultipleDevicesLimitStep
          onStartOver={onStartOver}
          subscriptionCode={stage.subscriptionCode}
        />
      );
    case LoginDeviceLimitFlowStage.UnlinkingAndOpeningSession:
    case LoginDeviceLimitFlowStage.DeviceLimitDone:
      return (
        <InitialSyncProgressStep
          stage={stage}
          setIsInitialSyncAnimationPending={setIsInitialSyncAnimationPending}
        />
      );
    case LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError:
      return null;
    default:
      assertUnreachable(stage);
  }
};
export { DeviceLimitFlow };
