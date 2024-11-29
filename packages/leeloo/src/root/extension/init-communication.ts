import { createEventBus } from "ts-event-bus";
import { BrowserPortConnector } from "@dashlane/framework-infra";
import carbonConnectorInstance from "../../libs/carbon/connector/instance";
import { carbonEvents } from "../../libs/carbon/connector/events";
import WebExtensionChannel from "./extension-channel";
const FOREGROUND_TO_BACKGROUND_CHANNEL_NAME = "graphene-background-port";
export function initCommunication() {
  const lowLevelChannel = new BrowserPortConnector(
    FOREGROUND_TO_BACKGROUND_CHANNEL_NAME
  );
  const carbonConnector = createEventBus({
    events: carbonEvents,
    channels: [WebExtensionChannel],
  });
  carbonConnectorInstance.setCarbonConnector(carbonConnector);
  return {
    channelToBackgroundGraphene: lowLevelChannel,
    channelToBackgroundCarbon: WebExtensionChannel,
  };
}
