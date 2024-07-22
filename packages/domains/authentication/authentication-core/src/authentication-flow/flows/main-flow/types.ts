import { AnyStateMachine, Interpreter, State, StateFrom } from "xstate";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationMachineContext } from "./authentication.machine";
import { AuthenticationMachineEvents } from "./authentication.events";
export interface MachineService<
  TMachineContext,
  TMachineResult,
  TEvent = void
> {
  execute: (context: TMachineContext, event: TEvent) => Promise<TMachineResult>;
}
export type AuthenticationMachineState = State<
  AuthenticationMachineContext,
  AuthenticationMachineEvents,
  any,
  any
>;
export type AuthenticationMachineInterpreter = Interpreter<
  AuthenticationMachineContext,
  any,
  AuthenticationMachineEvents,
  any,
  any
>;
export type MachineInitializationResult = {
  localAccounts: AuthenticationFlowContracts.LocalAccount[];
  lastUsedLogin?: string;
  shouldAskMasterPassword?: boolean;
  shouldAskOTP?: boolean;
  shouldAskPinCode: boolean;
  rememberMeType?: AuthenticationFlowContracts.RememberMeType;
};
export type CheckAccountRecoveryStatusResult = {
  isAccountRecoveryAvailable: boolean;
};
export interface AuthenticationBaseError {
  code: string;
  data?: unknown;
}
export interface AuthenticationGenericError {
  code: "unknown_error";
  data?: {
    message: string;
  };
}
export interface AuthenticationMachineBaseContext {
  error?: AuthenticationBaseError;
  login?: string;
  serverKey?: string;
}
export type StateToViewMapper = {
  values: (string | Record<string, unknown>)[];
  view: (context: unknown) => Record<string, unknown>;
}[];
export const isMatch = (
  value: (string | Record<string, unknown>)[],
  state: StateFrom<AnyStateMachine>
): boolean => {
  return value.some(state.matches);
};
export function getView(
  viewMapper: StateToViewMapper,
  state: StateFrom<AnyStateMachine>
): Record<string, unknown> | undefined {
  const res = viewMapper.find((match) => {
    const { values } = match;
    return isMatch(values, state);
  });
  return res?.view(state.context);
}
export interface SSOSettingsData {
  ssoUser: boolean;
  serviceProviderUrl: string;
  migration?: AuthenticationFlowContracts.SSOMigrationType;
  ssoServiceProviderKey?: string;
  ssoToken?: string;
  isNitroProvider?: boolean;
}
export enum AuthenticationMethodForLogin {
  PIN_CODE = "PIN_CODE",
  CARBON_EVENT = "CARBON_EVENT",
}
