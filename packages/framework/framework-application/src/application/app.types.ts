import {
  AnyAppDefinition,
  ApisNamesOf,
  AppModules,
  BodyOfEvent,
  ClientsOf,
  exceptionLoggingApi,
  NodeIdentifiersOf,
  requestContextApi,
} from "@dashlane/framework-contracts";
import { ItemOfArray } from "@dashlane/framework-types";
import { Channel } from "../messaging/channel";
import { ChannelsListener } from "../messaging/channels-listener";
import { StoreInfrastructureFactory } from "../state/store/store-infrastructure-factory";
import { AppTimers } from "./app-timers";
import { AppLogger } from "./logger";
import {
  DefaultEncryptionCodecForDeviceData,
  DefaultEncryptionCodecForUserData,
  KeyValueStorageInfrastructure,
  ManagedStorageInfrastructure,
} from "../state";
import { JsonApplicationResourceFetcher } from "../resources/json-app-resource-fetcher";
import { CronLowLevelSource } from "../tasks/cron.types";
import {
  ModuleDeclaration,
  ModuleDeclarationShorthand,
} from "../dependency-injection/module.types";
import { ParameterProvider } from "../dependency-injection/parameter-provider.types";
import { ExceptionLoggingModuleConfig } from "../logging/exception/exception-logging.config";
import { RequestContext } from "../request-context/request-context";
export type LocallyImplementedApisOf<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> | null
> = {
  [TModuleName in keyof TAppDefinition]: TCurrentNode extends TAppDefinition[TModuleName]["main"]
    ? TModuleName
    : TCurrentNode extends ItemOfArray<TAppDefinition[TModuleName]["queryOnly"]>
    ? TModuleName
    : never;
}[keyof TAppDefinition];
export type SubscriptionOfModule<TAppDefinition extends AnyAppDefinition> = {
  [TSubscribedTo in ApisNamesOf<TAppDefinition>]?: (keyof TAppDefinition[TSubscribedTo]["api"]["events"])[];
};
export type LocalSubscriptions<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> | null
> = Partial<
  Record<
    LocallyImplementedApisOf<TAppDefinition, TCurrentNode>,
    SubscriptionOfModule<TAppDefinition>
  >
>;
export type RemoteChannelsName<TAppDefinition, TCurrentNode> =
  TCurrentNode extends null
    ? NodeIdentifiersOf<TAppDefinition>
    : Exclude<NodeIdentifiersOf<TAppDefinition>, TCurrentNode>;
type InternalMandatoryFrameworkModuleNames = (
  | typeof exceptionLoggingApi
  | typeof requestContextApi
)["name"];
export type MandatoryLocalModuleDeclarations<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
> = Record<
  Exclude<
    LocallyImplementedApisOf<TAppDefinition, TCurrentNode>,
    InternalMandatoryFrameworkModuleNames
  >,
  ModuleDeclaration | ModuleDeclarationShorthand
>;
export interface AppParam<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
> {
  readonly appDefinition: TAppDefinition;
  readonly currentNode: TCurrentNode;
  readonly channels: Record<
    RemoteChannelsName<TAppDefinition, TCurrentNode>,
    Channel
  >;
  readonly channelsListener?: ChannelsListener;
  readonly implementations: MandatoryLocalModuleDeclarations<
    TAppDefinition,
    TCurrentNode
  >;
  readonly otherModules?: (ModuleDeclaration | ModuleDeclarationShorthand)[];
  readonly logger?: AppLogger;
  readonly storeInfrastructureFactory?: StoreInfrastructureFactory;
  readonly keyValueStorageInfrastructure?: KeyValueStorageInfrastructure;
  readonly managedStorageInfrastructure?: ManagedStorageInfrastructure;
  readonly timers?: AppTimers;
  readonly jsonFetcher?: JsonApplicationResourceFetcher;
  readonly cronSource?: CronLowLevelSource;
  readonly defaultDeviceStorageEncryptionCodec?: ParameterProvider<DefaultEncryptionCodecForDeviceData>;
  readonly defaultUserStorageEncryptionCodec?: ParameterProvider<DefaultEncryptionCodecForUserData>;
  readonly exceptionLogging?: ExceptionLoggingModuleConfig;
}
export interface App<TAppDefinition extends AnyAppDefinition> {
  stop: () => Promise<void>;
  createClient: () => ClientsOf<AppModules<TAppDefinition>>;
  sendEvent: <
    TApi extends ApisNamesOf<TAppDefinition>,
    TEventName extends keyof TAppDefinition[TApi]["api"]["events"]
  >(
    sourceModule: TApi,
    eventName: TEventName,
    eventPayload: BodyOfEvent<
      TAppDefinition[TApi]["api"]["events"][TEventName]
    >,
    context?: RequestContext
  ) => Promise<void>;
}
