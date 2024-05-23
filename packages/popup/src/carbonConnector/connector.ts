import { Channel, combineEvents, createEventBus } from 'ts-event-bus';
import { CarbonApiConnector, CarbonApiEvents, ExtensionCarbonConnector, } from '@dashlane/communication';
import { PortNames } from '@dashlane/framework-infra/src/communication/channel/dl-channel';
import { RuntimeConnectSingle } from '@dashlane/framework-infra/src/communication/channel/runtime-connect-single';
const { PopupCarbon } = PortNames;
type CarbonEvents = typeof ExtensionCarbonConnector & CarbonApiEvents;
const carbonEvents: CarbonEvents = combineEvents(ExtensionCarbonConnector, CarbonApiConnector);
let carbonChannel: Channel;
const runtimeConnectChannel = new RuntimeConnectSingle(PopupCarbon);
runtimeConnectChannel.connect();
carbonChannel = runtimeConnectChannel;
export const carbonConnector = createEventBus({
    events: carbonEvents,
    channels: [carbonChannel],
});
export { carbonChannel as popupToCarbonChannel };
