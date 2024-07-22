import { equals } from "ramda";
import { IdentityVerificationMachineState } from "../flows/main-flow/types";
export const assertUnreachable = (): never => {
  throw new Error("Didn't expect to get here");
};
export const compareMachines = (
  prevState: IdentityVerificationMachineState,
  currState: IdentityVerificationMachineState
): boolean => {
  const isSameStep = currState.matches(prevState.value);
  const isSameContext = equals(prevState.context, currState.context);
  return isSameStep && isSameContext;
};
