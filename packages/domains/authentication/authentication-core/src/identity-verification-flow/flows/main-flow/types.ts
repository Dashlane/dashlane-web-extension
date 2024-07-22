import { AnyStateMachine, Interpreter, State, StateFrom } from "xstate";
import { IdentityVerificationMachineContext } from "./identity-verification.machine";
import { IdentityVerificationMachineEvents } from "./identity-verification.events";
export interface MachineService<
  TMachineContext,
  TMachineResult,
  TEvent = void
> {
  execute: (context: TMachineContext, event: TEvent) => Promise<TMachineResult>;
}
export type IdentityVerificationMachineState = State<
  IdentityVerificationMachineContext,
  IdentityVerificationMachineEvents,
  any,
  any
>;
export type IdentityVerificationMachineInterpreter = Interpreter<
  IdentityVerificationMachineContext,
  any,
  IdentityVerificationMachineEvents,
  any,
  any
>;
export interface IdentityVerificationMachineBaseContext {
  error?: string;
  login?: string;
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
