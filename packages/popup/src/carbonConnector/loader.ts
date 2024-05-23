import { Channel, createEventBus } from 'ts-event-bus';
import { CarbonApiConnector } from '@dashlane/communication';
import { PortNames } from '@dashlane/framework-infra/src/communication/channel/dl-channel';
import { RuntimeConnectSingle } from '@dashlane/framework-infra/src/communication/channel/runtime-connect-single';
const { PopupCarbonLoader } = PortNames;
let carbonChannel: Channel;
const runtimeConnectChannel = new RuntimeConnectSingle(PopupCarbonLoader);
runtimeConnectChannel.connect();
carbonChannel = runtimeConnectChannel;
export const carbonConnector = createEventBus({
    events: CarbonApiConnector,
    channels: [carbonChannel],
});
