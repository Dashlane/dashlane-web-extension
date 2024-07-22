import { State } from "xstate";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore } from "@dashlane/framework-application";
import { map, Observable } from "rxjs";
import { AuthenticationMachineState } from "../flows/main-flow/types";
const isAuthenticationFlowMachine = (x: unknown): x is string => {
  return true;
};
export class AuthenticationFlowMachineStore extends defineStore<
  string | undefined,
  string | undefined
>({
  initialValue: undefined,
  persist: false,
  scope: UseCaseScope.Device,
  storeName: "authentication-flow-machine",
  storeTypeGuard: isAuthenticationFlowMachine,
}) {}
export const clear = async (store: AuthenticationFlowMachineStore) => {
  await store.set(undefined);
};
export const serialize = async (
  store: AuthenticationFlowMachineStore,
  state: AuthenticationMachineState
) => {
  await store.set(JSON.stringify(state));
};
export const deserialize = async (
  store: AuthenticationFlowMachineStore
): Promise<AuthenticationMachineState | undefined> => {
  const data = await store.getState();
  return data ? State.create(JSON.parse(data)) : undefined;
};
export const deserialize$ = (
  store: AuthenticationFlowMachineStore
): Observable<AuthenticationMachineState | undefined> => {
  return store.state$.pipe(
    map((data) => {
      return data
        ? (State.create(JSON.parse(data)) as AuthenticationMachineState)
        : undefined;
    })
  );
};
