import * as xs from "xstate";
import { BehaviorSubject } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import {
  deserialize,
  serialize,
  TrustedDeviceFlowMachineStore,
} from "../stores/trusted-device-flow-machine.store";
import {
  TrustedDeviceFlowMachineEvents,
  TrustedDeviceFlowMachineInterpreter,
} from "../flows/trusted-device-flow";
import { TrustedDeviceFlowMachine } from "../flows/trusted-device-flow/trusted-device-flow.machine";
@Injectable()
export class TrustedDeviceFlow {
  private interpreter?: TrustedDeviceFlowMachineInterpreter;
  private trustedDeviceMachineStore: TrustedDeviceFlowMachineStore;
  public constructor(
    trustedDeviceFlowMachine: TrustedDeviceFlowMachine,
    trustedDeviceFlowMachineStore: TrustedDeviceFlowMachineStore
  ) {
    this.trustedDeviceMachineStore = trustedDeviceFlowMachineStore;
    const machine = trustedDeviceFlowMachine.create();
    this.interpreter = xs.interpret(machine).onTransition(async (event) => {
      if (!event.changed && (event.event.type as string) !== "xstate.init") {
        console.warn(
          `[D2D Trusted Device Flow] State is unchanged. Unexpected transition on ${JSON.stringify(
            event.value
          )} with event ${event.event.type} `
        );
      }
      try {
        const snapshot = this.interpreter?.getSnapshot();
        if (snapshot) {
          await serialize(this.trustedDeviceMachineStore, snapshot);
        }
      } catch (e) {
        console.warn("[D2D Trusted Device Flow] Unable to get snapshot", e);
      }
    });
  }
  public async prepare() {
    if (!this.interpreter) {
      return;
    } else {
      try {
        const storedState = await deserialize(this.trustedDeviceMachineStore);
        try {
          this.interpreter.start(storedState);
        } catch (error) {
          console.error(
            "[D2D Trusted Device Flow] Unable to reuse the stored state: ",
            error
          );
          this.interpreter.start();
        }
      } catch (e) {
        console.error("[D2D Trusted Device Flow] Unable to start machine", e);
      }
    }
  }
  public ready(): BehaviorSubject<boolean> {
    return new BehaviorSubject(true);
  }
  public continue(event: TrustedDeviceFlowMachineEvents) {
    if (!this.interpreter) {
      throw new Error("TrustedDevice flow not started");
    }
    this.interpreter.send(event);
  }
  public stop() {
    if (!this.isStarted()) {
      return;
    }
    this.interpreter = undefined;
  }
  public isStarted(): boolean {
    return Boolean(this.interpreter);
  }
}
