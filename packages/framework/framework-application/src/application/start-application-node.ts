import { NestInterceptor } from "@nestjs/common";
import {
  AnyAppDefinition,
  AnyModuleApis,
  ApplicationDefinition,
  exceptionLoggingApi,
  NodeIdentifiersOf,
  requestContextApi,
} from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
import { filter, firstValueFrom } from "rxjs";
import { NestFactory } from "@nestjs/core";
import { App, AppParam, MandatoryLocalModuleDeclarations } from "./app.types";
import { getSubscriptionsFromMetadata } from "./get-subscriptions-from-metadata";
import { AppModule } from "./nest-adapters/app-module";
import { ApplicationNodeAdapter } from "./nest-adapters/application-node-adapter";
import { AppLifeCycle } from "./app-lifecycle";
import { NodeEventBroker } from "../client/node-event-broker";
import { CqrsBroker } from "../client/cqrs-broker";
import { createCqrsClients } from "../client/create-cqrs-clients";
import {
  DefaultLogger,
  DefaultTimers,
  ThrowJsonFetcher,
} from "../start-application-node-defaults";
import {
  checkIfAllApisAreImplemented,
  readMetadataFromDeclaration,
} from "./application-node-metadata-reader";
import { NodeConfiguration, NoDynamicChannels } from "../messaging";
import {
  DefaultEncryptionCodecForDeviceData,
  DefaultEncryptionCodecForUserData,
} from "../state/storage/default-encryption-codec";
import {
  MemoryKeyValueStorageInfrastructure,
  MemoryManagedStorageInfrastructure,
} from "../state/storage/memory-key-value-storage-infrastructure";
import { MemoryStoreInfrastructureFactory } from "../state/store/store-infrastructure-factory";
import { TimerBasedCronSource } from "../tasks/cron.types";
import { ParameterProviderType } from "../dependency-injection/parameter-provider.types";
import { doFrameworkInit } from "./nest-adapters/do-framework-init";
import { parameterProviderToNestProvider } from "./nest-adapters/nest-provider";
import { StoreList } from "../state/store/store-list";
import { ExceptionLoggingModule } from "../logging/exception/exception-logging.module";
import { DEFAULT_EXCEPTION_LOGGING_CONFIG } from "../logging/exception/exception-logging.config";
import { RequestContext } from "../request-context/request-context";
import { ActiveUserInterceptor } from "./nest-adapters/interceptors/active-user.interceptor";
import { Class } from "@dashlane/framework-types";
import { CronRepository } from "../tasks/cron-repository";
import { CronsBroker } from "../tasks/crons-broker";
import { NodeModulesIntrospection } from "../dependency-injection/module.types";
import { UseCaseStacktraceInterceptor } from "../logging/exception/use-case-stacktrace.interceptor";
import { createModuleClientsProviders } from "./module-client";
import { getUserUseCaseScopeProvider } from "../use-case-scope/user-use-case-scope-provider";
import { resolveModuleDeclarationShorthand } from "../dependency-injection/module";
import { RequestContextModule } from "../index";
const ALL_BASE_INTERCEPTORS: Class<NestInterceptor>[] = [
  UseCaseStacktraceInterceptor,
  ActiveUserInterceptor,
];
const DUMMY_ADDRESS = "";
export const startApplicationNode = async <
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
>({
  appDefinition,
  channels,
  currentNode,
  implementations,
  otherModules = [],
  logger = new DefaultLogger(),
  storeInfrastructureFactory = new MemoryStoreInfrastructureFactory(),
  channelsListener = NoDynamicChannels,
  timers = new DefaultTimers(),
  keyValueStorageInfrastructure = new MemoryKeyValueStorageInfrastructure(),
  managedStorageInfrastructure = new MemoryManagedStorageInfrastructure(),
  jsonFetcher = new ThrowJsonFetcher(),
  cronSource = new TimerBasedCronSource(timers),
  defaultDeviceStorageEncryptionCodec = {
    type: ParameterProviderType.CLASS_PROVIDER,
    useClass: PassthroughCodec,
  },
  defaultUserStorageEncryptionCodec = {
    type: ParameterProviderType.CLASS_PROVIDER,
    useClass: PassthroughCodec,
  },
  exceptionLogging = DEFAULT_EXCEPTION_LOGGING_CONFIG,
}: AppParam<TAppDefinition, TCurrentNode>): Promise<App<TAppDefinition>> => {
  try {
    console.log("[background/framework] Starting application node");
    const onAbort = (() => {
      console.error("[background/framework] Unexpected call to process.abort");
      throw new Error("Aborted");
    }) as never;
    process.abort = onAbort;
    const onExit = (() => {
      console.error("[background/framework] Unexpected call to process.exit");
      throw new Error("Exited");
    }) as never;
    process.exit = onExit;
    const augmentedAppDefinition: TAppDefinition = {
      ...appDefinition,
      [exceptionLoggingApi.name]: {
        api: exceptionLoggingApi,
        main: currentNode,
        queryOnly: [],
      },
      [requestContextApi.name]: {
        api: requestContextApi,
        main: currentNode,
        queryOnly: [],
      },
    };
    const internalModules = [
      RequestContextModule,
      ExceptionLoggingModule.configure(exceptionLogging),
    ];
    const modulesDeclaration = [
      ...internalModules,
      ...otherModules,
      ...Object.keys(implementations)
        .map(
          (apiName) =>
            apiName as keyof MandatoryLocalModuleDeclarations<
              TAppDefinition,
              TCurrentNode
            >
        )
        .map((apiName) => implementations[apiName]),
    ].map(resolveModuleDeclarationShorthand);
    const {
      configProviders,
      modules,
      modulesMetadata,
      onFrameworkInits,
      crons,
      eventHandlers,
      stores,
      allDeclarations,
    } = readMetadataFromDeclaration<TAppDefinition, TCurrentNode>(
      logger,
      modulesDeclaration
    );
    const storeList = new StoreList();
    stores.forEach((store) => {
      storeList.registerClass(store);
    });
    checkIfAllApisAreImplemented<TAppDefinition, TCurrentNode>(
      augmentedAppDefinition,
      currentNode,
      modulesMetadata
    );
    const subscriptions = getSubscriptionsFromMetadata<
      TAppDefinition,
      TCurrentNode
    >(modulesMetadata);
    const nodeConfiguration = new NodeConfiguration({
      appDefinition: augmentedAppDefinition,
      channels,
      channelsListener,
      currentNode,
      subscriptions,
    });
    const cqrsBroker = new CqrsBroker<TAppDefinition, TCurrentNode>(
      nodeConfiguration
    );
    const eventsBroker = new NodeEventBroker<TAppDefinition, TCurrentNode>(
      nodeConfiguration
    );
    const cronBroker = new CronsBroker(
      {
        cronSource,
        repository: new CronRepository(
          keyValueStorageInfrastructure,
          currentNode
        ),
        timers,
      },
      crons
    );
    const httpAdapter = new ApplicationNodeAdapter(
      cqrsBroker,
      eventsBroker,
      cronBroker
    );
    const defaultDeviceStorageEncryptionCodecProvider =
      parameterProviderToNestProvider({
        token: DefaultEncryptionCodecForDeviceData,
        parameterProvider: defaultDeviceStorageEncryptionCodec,
      });
    const defaultUserStorageEncryptionCodecProvider =
      parameterProviderToNestProvider({
        token: DefaultEncryptionCodecForUserData,
        parameterProvider: defaultUserStorageEncryptionCodec,
      });
    const lifeCycle = new AppLifeCycle();
    const introspection = new NodeModulesIntrospection(
      new Set(eventHandlers),
      allDeclarations
    );
    const moduleClientsProviders = createModuleClientsProviders(
      augmentedAppDefinition
    );
    const userUseCaseScopeProvider = getUserUseCaseScopeProvider();
    const appModule = AppModule.create<TAppDefinition, TCurrentNode>({
      nodeConfiguration,
      brokers: { cqrs: cqrsBroker, event: eventsBroker },
      modules,
      configProviders,
      logger,
      lifeCycle,
      storeInfrastructureFactory,
      timers,
      keyValueStorageInfrastructure,
      managedStorageInfrastructure,
      jsonFetcher,
      defaultDeviceStorageEncryptionCodecProvider,
      defaultUserStorageEncryptionCodecProvider,
      storeList,
      interceptors: ALL_BASE_INTERCEPTORS,
      introspection,
      moduleClientsProviders,
      userUseCaseScopeProvider,
    });
    console.log("[background/framework] Creating NestApplication...");
    const app = await NestFactory.create(appModule, httpAdapter, {
      logger,
    });
    console.log("[background/framework] Initializing NestApplication...");
    const nestApp = await app.init();
    await doFrameworkInit(onFrameworkInits, nestApp);
    app.listen(DUMMY_ADDRESS);
    const isListening = httpAdapter.isListening$.pipe(filter((x) => !!x));
    await firstValueFrom(isListening);
    lifeCycle.addShutdownHook(() => app.close());
    await lifeCycle.startup();
    return {
      stop: () => lifeCycle.shutDown(),
      createClient: () => createCqrsClients(augmentedAppDefinition, cqrsBroker),
      sendEvent: (sourceModule, eventName, eventPayload, context) => {
        return eventsBroker.publishEvent(
          sourceModule,
          eventName,
          eventPayload,
          context ?? new RequestContext()
        );
      },
    };
  } catch (error) {
    console.error(
      "[background/framework] Exception when starting application node",
      error
    );
    throw error;
  }
};
export const startSingleApplicationNode = <
  TAppDefinition extends ApplicationDefinition<"node", AnyModuleApis>,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
>(
  params: Omit<
    AppParam<TAppDefinition, TCurrentNode>,
    "channels" | "currentNode"
  >
): Promise<App<TAppDefinition>> =>
  startApplicationNode({
    ...params,
    appDefinition: params.appDefinition,
    channels: {} as Record<string, never>,
    currentNode: "node" as NodeIdentifiersOf<TAppDefinition>,
  });
