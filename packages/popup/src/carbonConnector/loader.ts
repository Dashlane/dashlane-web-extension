import { Channel, createEventBus } from "ts-event-bus";
import { CarbonApiConnector } from "@dashlane/communication";
import {
  PortNames,
  RuntimeConnectSingle,
} from "@dashlane/legacy-communication";
const { PopupCarbonLoader } = PortNames;
let carbonChannel: Channel;
const runtimeConnectChannel = new RuntimeConnectSingle(PopupCarbonLoader);
runtimeConnectChannel.connect();
carbonChannel = runtimeConnectChannel;
export const carbonConnector = createEventBus({
  events: CarbonApiConnector,
  channels: [carbonChannel],
});
