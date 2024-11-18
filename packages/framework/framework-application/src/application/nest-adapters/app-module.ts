import {
  DynamicModule,
  ForwardReference,
  ClassProvider as NestClassProvider,
  FactoryProvider as NestFactoryProvider,
  NestInterceptor,
  Provider as NestProvider,
  ValueProvider as NestValueProvider,
  Type,
} from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import {
  AnyAppDefinition,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { CqrsBroker } from "../../client/cqrs-broker";
import {
  ContextLessCqrsClient,
  CqrsClient,
} from "../../client/cqrs-client.service";
import { NodeEventBroker } from "../../client/node-event-broker";
import { NodeConfiguration } from "../../messaging/node-configuration";
import { StoreInfrastructureFactory } from "../../state/store/store-infrastructure-factory";
import { AppLifeCycle } from "../app-lifecycle";
import { AppLogger } from "../../logging/logger";
import { BaseNestController } from "./base-nest-controller";
import { AppTimers } from "../app-timers";
import { CommandRefresherFactory } from "../../cqrs/cqrs-command-refresher";
import {
  DefaultEncryptionCodecForDeviceData,
  DefaultEncryptionCodecForUserData,
} from "../../state/storage/default-encryption-codec";
import {
  Base64Codec,
  JsonSerializationCodec,
  PassthroughCodec,
} from "@dashlane/framework-services";
import {
  KeyValueStorageFactory,
  KeyValueStorageInfrastructure,
  ManagedStorageInfrastructure,
} from "../../state";
import { JsonApplicationResourceFetcher } from "../../resources";
import { AllowedToFail } from "../../errors-handling/allowed-to-fail";
import { StoreFlusher } from "../../state/store/store-flusher";
import { StoreList } from "../../state/store/store-list";
import { ApplicationExceptionFilter } from "../../errors-handling/exception.filter";
import { RequestContextProvider } from "./request-context-provider";
import { RequestContext } from "../../request-context/request-context";
import { Class } from "@dashlane/framework-types";
import { NodeModulesIntrospection } from "../../dependency-injection/module.types";
import { UserUseCaseScope } from "../../use-case-scope/user-use-case-scope";
import { ObservableQueriesCacheBase } from "../../client/observable-queries-cache";
export interface BrokersOf<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
> {
  cqrs: CqrsBroker<TAppDefinition, TCurrentNode>;
  event: NodeEventBroker<TAppDefinition, TCurrentNode>;
}
export type ConfigurationProvider = NestClassProvider | NestValueProvider;
export interface AppModuleParams<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
> {
  nodeConfiguration: NodeConfiguration<TAppDefinition, TCurrentNode>;
  brokers: BrokersOf<TAppDefinition, TCurrentNode>;
  modules: (Type | DynamicModule | Promise<DynamicModule> | ForwardReference)[];
  configProviders: ConfigurationProvider[];
  logger: AppLogger;
  lifeCycle: AppLifeCycle;
  storeInfrastructureFactory: StoreInfrastructureFactory;
  timers: AppTimers;
  keyValueStorageInfrastructure: KeyValueStorageInfrastructure;
  managedStorageInfrastructure?: ManagedStorageInfrastructure;
  jsonFetcher: JsonApplicationResourceFetcher;
  defaultDeviceStorageEncryptionCodecProvider: NestProvider;
  defaultUserStorageEncryptionCodecProvider: NestProvider;
  storeList: StoreList;
  interceptors: Class<NestInterceptor>[];
  introspection: NodeModulesIntrospection;
  moduleClientsProviders: Array<NestFactoryProvider | NestValueProvider>;
  userUseCaseScopeProvider: NestFactoryProvider;
  queriesCache: ObservableQueriesCacheBase<TAppDefinition>;
}
export class AppModule {
  private static globalInterceptors: Class<NestInterceptor>[] = [];
  public static addGlobalNestInterceptor(interceptor: Class<NestInterceptor>) {
    this.globalInterceptors.push(interceptor);
  }
  public static create<
    TAppDefinition extends AnyAppDefinition,
    TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
  >({
    brokers,
    configProviders,
    keyValueStorageInfrastructure,
    managedStorageInfrastructure,
    lifeCycle,
    logger,
    modules,
    nodeConfiguration,
    storeInfrastructureFactory,
    timers,
    jsonFetcher,
    defaultDeviceStorageEncryptionCodecProvider,
    defaultUserStorageEncryptionCodecProvider,
    storeList,
    interceptors,
    introspection,
    moduleClientsProviders,
    userUseCaseScopeProvider,
    queriesCache,
  }: AppModuleParams<TAppDefinition, TCurrentNode>): DynamicModule {
    return {
      module: AppModule,
      providers: [
        {
          provide: KeyValueStorageInfrastructure,
          useValue: keyValueStorageInfrastructure,
        },
        {
          provide: ManagedStorageInfrastructure,
          useValue: managedStorageInfrastructure,
        },
        {
          provide: AppLifeCycle,
          useValue: lifeCycle,
        },
        {
          provide: NodeConfiguration,
          useValue: nodeConfiguration,
        },
        {
          provide: CqrsBroker,
          useValue: brokers.cqrs,
        },
        {
          provide: ObservableQueriesCacheBase,
          useValue: queriesCache,
        },
        {
          provide: NodeEventBroker,
          useValue: brokers.event,
        },
        { provide: JsonApplicationResourceFetcher, useValue: jsonFetcher },
        CqrsClient,
        ContextLessCqrsClient,
        ...configProviders,
        { provide: AppLogger, useValue: logger },
        RequestContextProvider,
        {
          provide: StoreInfrastructureFactory,
          useValue: storeInfrastructureFactory,
        },
        { provide: AppTimers, useValue: timers },
        CommandRefresherFactory,
        {
          provide: KeyValueStorageFactory,
          useValue: new KeyValueStorageFactory(keyValueStorageInfrastructure),
        },
        Base64Codec,
        defaultDeviceStorageEncryptionCodecProvider,
        defaultUserStorageEncryptionCodecProvider,
        JsonSerializationCodec,
        PassthroughCodec,
        {
          provide: NodeModulesIntrospection,
          useValue: introspection,
        },
        {
          provide: StoreList,
          useValue: storeList,
        },
        StoreFlusher,
        AllowedToFail,
        {
          provide: APP_FILTER,
          useClass: ApplicationExceptionFilter,
        },
        ...[...this.globalInterceptors, ...interceptors].flatMap((type) => [
          { provide: APP_INTERCEPTOR, useClass: type },
          type,
        ]),
        ...moduleClientsProviders,
        userUseCaseScopeProvider,
      ],
      imports: [...modules],
      exports: [
        AppLifeCycle,
        NodeConfiguration,
        CqrsBroker,
        NodeEventBroker,
        ObservableQueriesCacheBase,
        CqrsClient,
        ContextLessCqrsClient,
        ...configProviders.map(({ provide }) => provide),
        AppLogger,
        RequestContext,
        StoreInfrastructureFactory,
        AppTimers,
        CommandRefresherFactory,
        Base64Codec,
        DefaultEncryptionCodecForDeviceData,
        DefaultEncryptionCodecForUserData,
        JsonSerializationCodec,
        PassthroughCodec,
        KeyValueStorageFactory,
        KeyValueStorageInfrastructure,
        ManagedStorageInfrastructure,
        JsonApplicationResourceFetcher,
        StoreFlusher,
        AllowedToFail,
        NodeModulesIntrospection,
        ...moduleClientsProviders.map(({ provide }) => provide),
        UserUseCaseScope,
      ],
      controllers: [BaseNestController],
      global: true,
    };
  }
}
