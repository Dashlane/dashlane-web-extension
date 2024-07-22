import { State } from "xstate";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore } from "@dashlane/framework-application";
import { map, Observable } from "rxjs";
import { IdentityVerificationMachineState } from "../flows/main-flow/types";
const isIdentityVerificationFlowMachine = (x: unknown): x is string => {
  return true;
};
export class IdentityVerificationFlowMachineStore extends defineStore<
  string | undefined,
  string | undefined
>({
  initialValue: undefined,
  persist: false,
  scope: UseCaseScope.Device,
  storeName: "identity-verification-flow-machine",
  storeTypeGuard: isIdentityVerificationFlowMachine,
}) {}
export const serialize = async (
  store: IdentityVerificationFlowMachineStore,
  state: IdentityVerificationMachineState
) => {
  await store.set(JSON.stringify(state));
};
export const deserialize = async (
  store: IdentityVerificationFlowMachineStore
): Promise<IdentityVerificationMachineState | undefined> => {
  const data = await store.getState();
  return data ? State.create(JSON.parse(data)) : undefined;
};
export const deserialize$ = (
  store: IdentityVerificationFlowMachineStore
): Observable<IdentityVerificationMachineState | undefined> => {
  return store.state$.pipe(
    map((data) => {
      return data
        ? (State.create(JSON.parse(data)) as IdentityVerificationMachineState)
        : undefined;
    })
  );
};
