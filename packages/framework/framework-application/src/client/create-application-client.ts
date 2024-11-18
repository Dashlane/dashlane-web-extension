import {
  AnyAppDefinition,
  AppModules,
  ClientsOf,
  exceptionLoggingApi,
  requestContextApi,
} from "@dashlane/framework-contracts";
import { AppLifeCycle, RemoteChannelsName } from "../application";
import { Channel, ChannelsListener, NodeConfiguration } from "../messaging";
import { CqrsBroker } from "./cqrs-broker";
import { createCqrsClients } from "./create-cqrs-clients";
import { ObservableQueriesCache } from "./observable-queries-cache";
import { ContextLessCqrsClient } from "./cqrs-client.service";
import { distinctUntilChanged } from "rxjs";
export interface CreateApplicationClientParams<
  TAppDefinition extends AnyAppDefinition
> {
  readonly clientName?: string;
  readonly appDefinition: TAppDefinition;
  readonly channels: Record<RemoteChannelsName<TAppDefinition, null>, Channel>;
  readonly channelsListener: ChannelsListener;
}
export async function createApplicationClient<
  TAppDefinition extends AnyAppDefinition
>({
  clientName,
  appDefinition,
  channels,
  channelsListener,
}: CreateApplicationClientParams<TAppDefinition>): Promise<{
  client: ClientsOf<AppModules<TAppDefinition>>;
  stop: () => Promise<void>;
}> {
  const augmentedAppDefinition: TAppDefinition = {
    ...appDefinition,
    [exceptionLoggingApi.name]: {
      api: exceptionLoggingApi,
      main: "background",
      queryOnly: [],
    },
  };
  const nodeConfiguration = new NodeConfiguration({
    appDefinition: augmentedAppDefinition,
    channels,
    channelsListener,
    currentNode: null,
    subscriptions: {},
  });
  const broker = new CqrsBroker(nodeConfiguration);
  const lifeCycle = new AppLifeCycle();
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
  const queriesCache = new ObservableQueriesCache(lifeCycle);
  const contextLessClient = new ContextLessCqrsClient<TAppDefinition, null>(
    nodeConfiguration,
    broker,
    queriesCache
  );
  lifeCycle.addAppReadyHook(() => {
    const userSubscription = contextLessClient
      .getClient(requestContextApi)
      .queries.activeUser()
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        queriesCache.clearUserCache();
      });
    return () => userSubscription.unsubscribe();
  });
  lifeCycle.addShutdownHook(async () => {
    await (await brokerStarted).stop();
  });
  await lifeCycle.startup();
  return {
    client: createCqrsClients<TAppDefinition, null>(
      clientName ?? "client",
      appDefinition,
      broker,
      queriesCache
    ),
    stop: async () => {
      await lifeCycle.shutDown();
    },
  };
}
