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
import { distinctUntilChanged, filter, firstValueFrom } from "rxjs";
import { NestFactory } from "@nestjs/core";
import { ContextIdFactory } from "@nestjs/core/helpers/context-id-factory.js";
import { App, AppParam, MandatoryLocalModuleDeclarations } from "./app.types";
import { getSubscriptionsFromMetadata } from "./get-subscriptions-from-metadata";
import { AppModule } from "./nest-adapters/app-module";
import { ApplicationNodeAdapter } from "./nest-adapters/application-node-adapter";
import { AppLifeCycle } from "./app-lifecycle";
import { NodeEventBroker } from "../client/node-event-broker";
import { CqrsBroker } from "../client/cqrs-broker";
import { createCqrsClients } from "../client/create-cqrs-clients";
import { ObservableQueriesCache } from "../client/observable-queries-cache";
import {
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
import { ExceptionLoggingModule } from "../exception-logging/exception-logging.module";
import { DEFAULT_DIAGNOSTICS_LOGS_PROCESSOR } from "../diagnostics/config";
import { DEFAULT_EXCEPTION_LOGGING_CONFIG } from "../exception-logging/exception-logging.config";
import { ActiveUserInterceptor } from "./nest-adapters/interceptors/active-user.interceptor";
import { Class } from "@dashlane/framework-types";
import { CronRepository } from "../tasks/cron-repository";
import { CronsBroker } from "../tasks/crons-broker";
import { NodeModulesIntrospection } from "../dependency-injection/module.types";
import { UseCaseStacktraceInterceptor } from "../exception-logging/use-case-stacktrace.interceptor";
import { createModuleClientsProviders } from "./module-client";
import { getUserUseCaseScopeProvider } from "../use-case-scope/user-use-case-scope-provider";
import { resolveModuleDeclarationShorthand } from "../dependency-injection/module";
import { ExceptionLogger } from "../exception-logging/exception-logger";
import { ExceptionCriticalityValues } from "../exception-logging/exception-logging.types";
import { RequestContextModule } from "../shared-modules/context/request-context.module";
import { AppLogger } from "../logging/logger";
import { DiagnosticsModule } from "../diagnostics/module";
import { provideValue } from "../dependency-injection/parameter-provider";
import { DiagnosticsLogsSources } from "../diagnostics/infra";
import { ContextLessCqrsClient } from "../client/cqrs-client.service";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../request-context/request-context";
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
  storeInfrastructureFactory = new MemoryStoreInfrastructureFactory(),
  channelsListener = NoDynamicChannels,
  timers = new DefaultTimers(),
  keyValueStorageInfrastructure = new MemoryKeyValueStorageInfrastructure(),
  managedStorageInfrastructure = new MemoryManagedStorageInfrastructure(),
  logger = AppLogger.create({
    container: "framework",
    module: "kernel",
    domain: "framework",
    infra: keyValueStorageInfrastructure,
  }),
  externalLoggers = [],
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
  diagnosticsLogProcessor = DEFAULT_DIAGNOSTICS_LOGS_PROCESSOR,
}: AppParam<TAppDefinition, TCurrentNode>): Promise<App<TAppDefinition>> => {
  try {
    logger.debug("Starting application node");
    const onAbort = (() => {
      logger.error("Unexpected call to process.abort");
      throw new Error("Aborted");
    }) as never;
    process.abort = onAbort;
    const onExit = (() => {
      logger.error("Unexpected call to process.exit");
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
      DiagnosticsModule.configure({
        externalDiagnosticsLogsSources: provideValue(
          new DiagnosticsLogsSources([
            logger.diagnostics.getLogsStream$(),
            ...externalLoggers.map((logr) => logr.diagnostics.getLogsStream$()),
          ])
        ),
        processorAdapter: diagnosticsLogProcessor,
      }),
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
    const lifeCycle = new AppLifeCycle(logger);
    const introspection = new NodeModulesIntrospection(
      new Set(eventHandlers),
      allDeclarations
    );
    const moduleClientsProviders = createModuleClientsProviders(
      augmentedAppDefinition
    );
    const userUseCaseScopeProvider = getUserUseCaseScopeProvider();
    const queriesCache = new ObservableQueriesCache(lifeCycle);
    const contextLessClient = new ContextLessCqrsClient(
      nodeConfiguration,
      cqrsBroker,
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
      queriesCache,
    });
    logger.debug("Creating NestApplication");
    const app = await NestFactory.create(appModule, httpAdapter, {
      logger: AppLogger.createNull(),
    });
    httpAdapter.setAppInstance(app);
    logger.debug("Initializing NestApplication");
    const nestApp = await app.init();
    const exceptionLogger = await nestApp.resolve<ExceptionLogger>(
      ExceptionLogger
    );
    try {
      await doFrameworkInit(onFrameworkInits, nestApp, exceptionLogger, logger);
      logger.debug("Start CQRS, event & CRON brokers");
      app.listen(DUMMY_ADDRESS);
      const isListening = httpAdapter.isListening$.pipe(filter((x) => !!x));
      await firstValueFrom(isListening);
      lifeCycle.addShutdownHook(() => app.close());
      await lifeCycle.startup(exceptionLogger);
    } catch (initError) {
      void exceptionLogger.captureException(
        initError,
        {
          origin: "exceptionBoundary",
          domainName: "framework",
          moduleName: "kernel",
        },
        ExceptionCriticalityValues.CRITICAL
      );
      throw initError;
    }
    return {
      stop: () => lifeCycle.shutDown(),
      createClient: () =>
        createCqrsClients<TAppDefinition, TCurrentNode>(
          currentNode,
          augmentedAppDefinition,
          cqrsBroker,
          queriesCache
        ),
      sendEvent: (sourceModule, eventName, eventPayload, inboundContext) => {
        const context =
          inboundContext ??
          new RequestContext().withValue(
            FrameworkRequestContextValues.UseCaseId,
            String(ContextIdFactory.create().id)
          );
        return eventsBroker.publishEvent(
          sourceModule,
          eventName,
          eventPayload,
          context
        );
      },
    };
  } catch (error) {
    logger.error("Exception when starting application node", { error });
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
