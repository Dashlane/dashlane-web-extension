import { Redirect } from "react-router-dom";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { DeviceTransferInstructions } from "./components/device-transfer-instructions";
import { DeviceTransferPassphrase } from "./components/device-transfer-passphrase";
import { DEVICE_TRANSFER_SUCCESS_SEGMENT } from "../../../../../app/routes/constants";
import { DeviceTransferError } from "./components/device-transfer-error";
import { DeviceTransferLoading } from "./components/device-transfer-loading";
import { DeviceTransferNoExtension } from "./components/device-transfer-no-extension";
import { AuthLocationState } from "../../../authentication-flow-login-panel";
interface Props
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowDeviceToDeviceAuthenticationView,
    "step"
  > {
  location: AuthLocationState;
}
export const DeviceToDeviceAuthentication = ({
  loginEmail,
  passphrase,
  deviceToDeviceStep,
  error,
  location,
}: Props) => {
  const getCurrentStep = () => {
    if (!APP_PACKAGED_IN_EXTENSION)
      return <DeviceTransferNoExtension loginEmail={loginEmail} />;
    switch (deviceToDeviceStep) {
      case AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .DisplayInstructions:
        return (
          <DeviceTransferInstructions
            loginEmail={loginEmail}
            location={location}
          />
        );
      case AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .LoadingPassphrase:
        return <DeviceTransferLoading step="LOADING_PASSPHRASE" />;
      case AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .DisplayPassphrase:
        return (
          <DeviceTransferPassphrase
            loginEmail={loginEmail}
            passphrase={passphrase}
          />
        );
      case AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .LoadingAccount:
        return <DeviceTransferLoading step="LOADING_ACCOUNT" />;
      case AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .DeviceRegistered:
        return <Redirect to={DEVICE_TRANSFER_SUCCESS_SEGMENT} />;
      case AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .Error:
        return <DeviceTransferError error={error} />;
      default:
        return null;
    }
  };
  return getCurrentStep();
};
