import {
  AnyAppDefinition,
  AppModules,
  ClientsOf,
} from "@dashlane/framework-contracts";
import { RemoteChannelsName } from "../application";
import { Channel, ChannelsListener, NodeConfiguration } from "../messaging";
import { CqrsBroker } from "./cqrs-broker";
import { createCqrsClients } from "./create-cqrs-clients";
export interface CreateApplicationClientParams<
  TAppDefinition extends AnyAppDefinition
> {
  readonly appDefinition: TAppDefinition;
  readonly channels: Record<RemoteChannelsName<TAppDefinition, null>, Channel>;
  readonly channelsListener: ChannelsListener;
}
export function createApplicationClient<
  TAppDefinition extends AnyAppDefinition
>({
  appDefinition,
  channels,
  channelsListener,
}: CreateApplicationClientParams<TAppDefinition>): {
  client: ClientsOf<AppModules<TAppDefinition>>;
  stop: () => Promise<void>;
} {
  const nodeConfiguration = new NodeConfiguration({
    appDefinition,
    channels,
    channelsListener,
    currentNode: null,
    subscriptions: {},
  });
  const broker = new CqrsBroker(nodeConfiguration);
  const reject = () => {
    throw new Error(
      "Unexpected request received by detached application client"
    );
  };
  const brokerStarted = broker
    .connect({
      onCommand: reject,
      onQuery: reject,
    })
    .start();
  return {
    client: createCqrsClients(appDefinition, broker),
    stop: async () => (await brokerStarted).stop(),
  };
}
