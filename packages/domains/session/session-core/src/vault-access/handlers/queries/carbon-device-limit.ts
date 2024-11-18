import {
  LoginDeviceLimitFlowStage,
  LoginDeviceLimitFlowView,
} from "@dashlane/communication";
export const testIsDeviceLimited = (
  status: LoginDeviceLimitFlowView | null
) => {
  return (
    !!status?.name &&
    status.name !== LoginDeviceLimitFlowStage.DeviceLimitDone &&
    status.name !==
      LoginDeviceLimitFlowStage.OpeningSessionAfterDeviceLimitRemoval
  );
};
