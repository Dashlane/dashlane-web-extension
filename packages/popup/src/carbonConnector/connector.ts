import { Channel, combineEvents, createEventBus } from "ts-event-bus";
import {
  CarbonApiConnector,
  CarbonApiEvents,
  ExtensionCarbonConnector,
} from "@dashlane/communication";
import {
  PortNames,
  RuntimeConnectSingle,
} from "@dashlane/legacy-communication";
const { PopupCarbon } = PortNames;
type CarbonEvents = typeof ExtensionCarbonConnector & CarbonApiEvents;
const carbonEvents: CarbonEvents = combineEvents(
  ExtensionCarbonConnector,
  CarbonApiConnector
);
let carbonChannel: Channel;
const runtimeConnectChannel = new RuntimeConnectSingle(PopupCarbon);
runtimeConnectChannel.connect();
carbonChannel = runtimeConnectChannel;
export const carbonConnector = createEventBus({
  events: carbonEvents,
  channels: [carbonChannel],
});
export { carbonChannel as popupToCarbonChannel };
