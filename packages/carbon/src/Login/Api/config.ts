import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { LoginCommands } from "Login/Api/commands";
import { LoginLiveQueries } from "Login/Api/live-queries";
import { LoginQueries } from "Login/Api/queries";
import { loginViaSSO } from "Login/SSO/LoginViaSSO";
import { viewedLoginDeviceLimitFlowSelector } from "Login/DeviceLimit/device-limit-flow.selectors";
import { unlinkPreviousDevice } from "Login/DeviceLimit/unlink-previous-device.command-handler";
import { unlinkMultipleDevices } from "Login/DeviceLimit/unlink-multiple-devices.command-handler";
import { loginDeviceLimitFlowView$ } from "Login/DeviceLimit/device-limit-flow.live";
import { abortDeviceLimitFlow } from "Login/DeviceLimit/abort-device-limit-flow.command-handler";
export const config: CommandQueryBusConfig<
  LoginCommands,
  LoginQueries,
  LoginLiveQueries
> = {
  commands: {
    abortDeviceLimitFlow: { handler: abortDeviceLimitFlow },
    loginViaSSO: { handler: loginViaSSO },
    unlinkPreviousDevice: { handler: unlinkPreviousDevice },
    unlinkMultipleDevices: { handler: unlinkMultipleDevices },
  },
  queries: {
    getLoginDeviceLimitFlow: {
      selector: viewedLoginDeviceLimitFlowSelector,
    },
  },
  liveQueries: {
    liveLoginDeviceLimitFlow: { operator: loginDeviceLimitFlowView$ },
  },
};
