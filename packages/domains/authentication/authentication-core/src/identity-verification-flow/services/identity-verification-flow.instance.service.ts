import { BehaviorSubject } from "rxjs";
import { interpret, waitFor } from "xstate";
import { Injectable } from "@dashlane/framework-application";
import {
  deserialize,
  IdentityVerificationFlowMachineStore,
  serialize,
} from "../stores/identity-verification-flow-machine.store";
import { IdentityVerificationMachineInterpreter } from "../flows/main-flow/types";
import { IdentityVerificationMachineEvents } from "../flows/main-flow/identity-verification.events";
import { IdentityVerificationMachine } from "../flows/main-flow/identity-verification.machine";
@Injectable()
export class IdentityVerificationFlow {
  private interpreter?: IdentityVerificationMachineInterpreter;
  private identityVerificationMachineStore: IdentityVerificationFlowMachineStore;
  private delayedEvents: IdentityVerificationMachineEvents[];
  private initFlag: BehaviorSubject<boolean>;
  public constructor(
    identityVerificationMachine: IdentityVerificationMachine,
    identityVerificationMachineStore: IdentityVerificationFlowMachineStore
  ) {
    this.identityVerificationMachineStore = identityVerificationMachineStore;
    this.initFlag = new BehaviorSubject<boolean>(false);
    const machine = identityVerificationMachine.create();
    this.delayedEvents = [];
    this.interpreter = interpret(machine).onTransition(async (event) => {
      if (!event.changed && (event.event.type as string) !== "xstate.init") {
        console.warn(
          `[Auth Ticket] State is unchanged. Unexpected transition on ${JSON.stringify(
            event.value
          )} with event ${event.event.type} `
        );
      }
      try {
        const snapshot = this.interpreter?.getSnapshot();
        if (snapshot) {
          await serialize(this.identityVerificationMachineStore, snapshot);
        }
      } catch (e) {
        console.warn("[Auth Ticket] Unable to get snapshot", e);
      }
    });
  }
  public async prepare() {
    if (!this.interpreter) {
      return;
    } else {
      try {
        const storedState = await deserialize(
          this.identityVerificationMachineStore
        );
        let actor: IdentityVerificationMachineInterpreter;
        try {
          actor = this.interpreter.start(storedState);
        } catch (error) {
          console.error(
            "[Auth Ticket] Unable to reuse the stored state: ",
            error
          );
          actor = this.interpreter.start();
        }
        await waitFor(actor, (state) => state.context.ready);
        this.interpreter.send(this.delayedEvents);
        this.delayedEvents = [];
        this.initFlag.next(true);
      } catch (e) {
        console.error("[Auth Ticket] Unable to start machine", e);
      }
    }
  }
  public ready(): BehaviorSubject<boolean> {
    return this.initFlag;
  }
  public continue(event: IdentityVerificationMachineEvents) {
    if (!this.interpreter) {
      throw new Error("Authentication flow not started");
    }
    if (!this.interpreter.getSnapshot().context.ready) {
      this.delayedEvents.push(event);
    } else {
      this.interpreter.send(event);
    }
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
