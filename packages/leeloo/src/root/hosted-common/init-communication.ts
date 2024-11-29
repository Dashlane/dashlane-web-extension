import { createEventBus } from "ts-event-bus";
import { WorkerChannel } from "@dashlane/legacy-communication";
import { PageToWorkerChannel } from "@dashlane/framework-infra";
import { carbonEvents } from "../../libs/carbon/connector/events";
import carbonConnectorInstance from "../../libs/carbon/connector/instance";
import {
  LEELOO_TO_BACKGROUND_CARBON_CHANNEL_NAME,
  LEELOO_TO_BACKGROUND_MODULES_CHANNEL_NAME,
} from "./common/communication";
export function initCommunication(backgroundWorker: Worker) {
  const lowLevelChannel = new PageToWorkerChannel(
    backgroundWorker,
    LEELOO_TO_BACKGROUND_MODULES_CHANNEL_NAME
  );
  const backgroundChannel = new WorkerChannel({
    type: LEELOO_TO_BACKGROUND_CARBON_CHANNEL_NAME,
    isHost: false,
    timeout: 10 * 60 * 1000,
  });
  const carbonConnector = createEventBus({
    events: carbonEvents,
    channels: [backgroundChannel],
  });
  carbonConnectorInstance.setCarbonConnector(carbonConnector);
  backgroundChannel.setWorker(backgroundWorker);
  return {
    channelToBackgroundGraphene: lowLevelChannel,
    channelToBackgroundCarbon: backgroundChannel,
  };
}
