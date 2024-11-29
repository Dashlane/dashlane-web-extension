import { createEventBus } from "ts-event-bus";
import { PageToWorkerChannel } from "@dashlane/framework-infra";
import {
  connectLocalChannels,
  LocalChannel,
  WorkerChannel,
} from "@dashlane/legacy-communication";
import {
  CarbonApiConnector,
  CarbonLeelooConnector,
  DeviceLimitCapabilityConnector,
} from "@dashlane/communication";
import {
  LEELOO_TO_BACKGROUND_CARBON_CHANNEL_NAME,
  LEELOO_TO_BACKGROUND_MODULES_CHANNEL_NAME,
} from "../common/communication";
export async function initCommunication(
  self: CarbonWorker,
  ignoredEvents: (keyof typeof CarbonLeelooConnector)[]
) {
  const workerToPageGrapheneChannel = new PageToWorkerChannel(
    self,
    LEELOO_TO_BACKGROUND_MODULES_CHANNEL_NAME
  );
  workerToPageGrapheneChannel.setConnected();
  const CARBON_GRAPHENE_TIMEOUT = 30000;
  const _CARBON_GRAPHENE_CHANNEL = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
  const _GRAPHENE_CARBON_CHANNEL = new LocalChannel(CARBON_GRAPHENE_TIMEOUT);
  connectLocalChannels(_CARBON_GRAPHENE_CHANNEL, _GRAPHENE_CARBON_CHANNEL);
  const _LEELOO_CARBON_TO_GRAPHENE_CHANNEL = new LocalChannel(
    CARBON_GRAPHENE_TIMEOUT
  );
  const _GRAPHENE_TO_LEELOO_CARBON_CHANNEL = new LocalChannel(
    CARBON_GRAPHENE_TIMEOUT
  );
  const grapheneLeelooCarbonConnector = createEventBus({
    events: CarbonLeelooConnector,
    channels: [_GRAPHENE_TO_LEELOO_CARBON_CHANNEL],
    ignoredEvents,
  }) as typeof CarbonLeelooConnector;
  const channel = new WorkerChannel({
    worker: self,
    type: LEELOO_TO_BACKGROUND_CARBON_CHANNEL_NAME,
    isHost: true,
  });
  const carbonApiConnector = createEventBus({
    events: CarbonApiConnector,
    channels: [channel, _CARBON_GRAPHENE_CHANNEL],
  });
  const carbonLelooConnector = createEventBus({
    events: CarbonLeelooConnector,
    channels: [channel, _LEELOO_CARBON_TO_GRAPHENE_CHANNEL],
  });
  const deviceLimitInfrastructureConnector = createEventBus({
    events: DeviceLimitCapabilityConnector,
    channels: [channel],
  });
  const appModulesCarbonConnector = createEventBus({
    events: CarbonApiConnector,
    channels: [_GRAPHENE_CARBON_CHANNEL],
  });
  connectLocalChannels(_CARBON_GRAPHENE_CHANNEL, _GRAPHENE_CARBON_CHANNEL);
  connectLocalChannels(
    _LEELOO_CARBON_TO_GRAPHENE_CHANNEL,
    _GRAPHENE_TO_LEELOO_CARBON_CHANNEL
  );
  return {
    appModulesCarbonConnector,
    carbonApiConnector,
    carbonLelooConnector,
    grapheneLeelooCarbonConnector,
    deviceLimitInfrastructureConnector,
    workerToPageGrapheneChannel,
  };
}
