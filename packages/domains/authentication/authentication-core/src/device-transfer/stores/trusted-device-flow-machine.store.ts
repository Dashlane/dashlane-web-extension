import { State } from "xstate";
import { map, Observable } from "rxjs";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { defineStore } from "@dashlane/framework-application";
import { TrustedDeviceFlowMachineState } from "../flows/trusted-device-flow";
const isTrustedDeviceFlowMachine = (x: unknown): x is string => {
  return true;
};
export class TrustedDeviceFlowMachineStore extends defineStore<
  string | undefined,
  string | undefined
>({
  initialValue: undefined,
  persist: false,
  scope: UseCaseScope.Device,
  storeName: "trusted-device-flow-machine",
  storeTypeGuard: isTrustedDeviceFlowMachine,
}) {}
export const serialize = async (
  store: TrustedDeviceFlowMachineStore,
  state: TrustedDeviceFlowMachineState
) => {
  await store.set(JSON.stringify(state));
};
export const deserialize = async (
  store: TrustedDeviceFlowMachineStore
): Promise<TrustedDeviceFlowMachineState | undefined> => {
  const data = await store.getState();
  return data ? State.create(JSON.parse(data)) : undefined;
};
export const deserialize$ = (
  store: TrustedDeviceFlowMachineStore
): Observable<TrustedDeviceFlowMachineState | undefined> => {
  return store.state$.pipe(
    map((data) => {
      return data
        ? (State.create(JSON.parse(data)) as TrustedDeviceFlowMachineState)
        : undefined;
    })
  );
};
