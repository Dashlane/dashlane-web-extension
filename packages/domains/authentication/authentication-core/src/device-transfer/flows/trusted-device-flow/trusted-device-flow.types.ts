import { AnyStateMachine, Interpreter, State, StateFrom } from "xstate";
import { TrustedDeviceFlowMachineEvents } from "./trusted-device-flow.events";
import { DeviceTransferContracts } from "@dashlane/authentication-contracts";
import { XstateFunctionalError } from "@dashlane/xstate-utils";
export interface MachineService<
  TMachineContext,
  TMachineResult,
  TEvent = void
> {
  execute: (context: TMachineContext, event: TEvent) => Promise<TMachineResult>;
}
export const PASSPHRASE_MAX_ATTEMPTS = 3;
export interface TrustedDeviceFlowMachineContext {
  transferId?: string;
  untrustedDeviceName: string;
  untrustedDeviceHashedPublicKey: string;
  untrustedDeviceLocation: string;
  requestTimestamp?: number;
  sharedSecret: string;
  passphrase: string;
  passphraseGuess: string;
  passphraseMissingWordIndex: number;
  passphraseAttemptsLeft: number;
  error?: DeviceTransferContracts.TrustedDeviceFlowErrors;
}
export type TrustedDeviceFlowMachineState = State<
  TrustedDeviceFlowMachineContext,
  TrustedDeviceFlowMachineEvents,
  any,
  any
>;
export type TrustedDeviceFlowMachineInterpreter = Interpreter<
  TrustedDeviceFlowMachineContext,
  any,
  TrustedDeviceFlowMachineEvents,
  any,
  any
>;
export class TrustedDeviceFlowError extends XstateFunctionalError {
  constructor(
    message: string,
    public readonly code: Exclude<
      DeviceTransferContracts.TrustedDeviceFlowErrors,
      DeviceTransferContracts.TrustedDeviceFlowErrors.GENERIC_ERROR
    >
  ) {
    super(message);
  }
}
export interface GetPendingDeviceRequestResponse {
  transferId?: string;
  untrustedDeviceName?: string;
  untrustedDeviceLocation?: string;
  requestTimestamp?: number;
  untrustedDeviceHashedPublicKey?: string;
}
export interface ApproveDeviceRequestResponse {
  sharedSecret: string;
  passphrase: string;
  passhraseMissingWordIndex: number;
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
