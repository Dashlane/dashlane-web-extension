import {
  CarbonApiEvents,
  CarbonMaverickConnector,
} from "@dashlane/communication";
import { ClientsOf } from "@dashlane/framework-contracts";
import { BaseAutofillEngineCommand } from "../../implementation/abstractions/messaging/command-serializer";
import { CapturedCredentialData } from "../../implementation/modules/dataCapture/credential-capture-helpers";
import { BrowserApi } from "../types/browser/browser-api";
import { AutofillEngineExceptionLogger } from "../types/logger";
import { WebcardData } from "../types/webcards/webcard-data";
import { AutofillEngineState } from "./state";
import { AutofillEngineApplicationDependencies } from "./application-dependencies";
export interface AutofillEngineInjectedConnectors {
  carbon: CarbonApiEvents;
  legacyCarbon: typeof CarbonMaverickConnector;
  grapheneClientPromise: Promise<
    ClientsOf<AutofillEngineApplicationDependencies>
  >;
}
export interface AutofillEngineConnectors
  extends Omit<AutofillEngineInjectedConnectors, "grapheneClientPromise"> {
  grapheneClient: ClientsOf<AutofillEngineApplicationDependencies>;
}
export type { AutofillEngineApplicationDependencies };
export enum MultiStepsLogin {
  STEP = "step",
  FINAL = "final",
}
export interface AutofillEngineTabStatePrivate extends AutofillEngineState {
  origin?: string;
  persistentWebcards?: {
    [webcardId: string]: WebcardData;
  };
  pendingWebauthnOperations?: {
    [webcardId: string]: {
      readonly origin: string;
    };
  };
  lastAutologin?: {
    domain: string;
    isMultiSteps: boolean;
    step?: MultiStepsLogin;
  };
  dataCaptureStepData?: {
    domain: string;
    capturedData: Partial<CapturedCredentialData>;
    firstStepUrl?: string;
  };
}
export const initialTabState: AutofillEngineTabStatePrivate = {};
export interface AutofillEngineGlobalStatePrivate extends AutofillEngineState {
  isRightClickMenuLive?: boolean;
}
export const initialGlobalState: AutofillEngineGlobalStatePrivate = {
  isRightClickMenuLive: false,
};
export interface GlobalState {
  get: () => Promise<AutofillEngineGlobalStatePrivate>;
  set: (newState: AutofillEngineGlobalStatePrivate) => Promise<void>;
}
interface TabState {
  get: () => Promise<AutofillEngineTabStatePrivate>;
  set: (newState: AutofillEngineTabStatePrivate) => Promise<void>;
}
export interface State {
  global: GlobalState;
  tab: TabState;
}
export interface AutofillEngineContext {
  readonly state: State;
  readonly browserApi: BrowserApi;
  readonly command?: BaseAutofillEngineCommand;
  readonly connectors: AutofillEngineConnectors;
  readonly grapheneClient: ClientsOf<AutofillEngineApplicationDependencies>;
  readonly logException: AutofillEngineExceptionLogger;
}
