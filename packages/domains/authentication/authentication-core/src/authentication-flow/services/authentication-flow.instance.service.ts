import * as xs from "xstate";
import { waitFor } from "xstate/lib/waitFor";
import { AllowedToFail, Injectable } from "@dashlane/framework-application";
import { CarbonLegacyClient } from "@dashlane/communication";
import {
  makeLogErrorListener,
  makeOnUnexpectedTransitionListener,
} from "@dashlane/xstate-utils";
import {
  AuthenticationFlowMachineStore,
  deserialize,
  serialize,
} from "../stores/authentication-flow-machine.store";
import { AbortDeviceLimitEventHandler } from "../carbon/abort-device-limit.event.handler";
import { AuthenticationMachineInterpreter } from "../flows/main-flow/types";
import { AuthenticationMachineEvents } from "../flows/main-flow/authentication.events";
import { AuthenticationMachine } from "../flows/main-flow/authentication.machine";
@Injectable()
export class AuthenticationFlow {
  private interpreter: AuthenticationMachineInterpreter;
  private loginMachineStore: AuthenticationFlowMachineStore;
  private abortDeviceLimitEventHandler: AbortDeviceLimitEventHandler;
  public constructor(
    authenticationFlowMachine: AuthenticationMachine,
    loginMachineStore: AuthenticationFlowMachineStore,
    withDebugLogs: boolean,
    private carbon: CarbonLegacyClient,
    private allowedToFail: AllowedToFail
  ) {
    this.loginMachineStore = loginMachineStore;
    const machine = authenticationFlowMachine.create(withDebugLogs);
    this.interpreter = xs
      .interpret(machine)
      .onTransition(
        makeOnUnexpectedTransitionListener((err: Error) =>
          this.allowedToFail.doOne(() => {
            throw err;
          })
        )
      )
      .onEvent(
        makeLogErrorListener((err: Error) =>
          this.allowedToFail.doOne(() => {
            throw err;
          })
        )
      )
      .onTransition(async () => {
        const snapshot = this.interpreter.getSnapshot();
        await serialize(this.loginMachineStore, snapshot);
      });
    this.abortDeviceLimitEventHandler = new AbortDeviceLimitEventHandler(
      this.interpreter,
      this.carbon
    );
  }
  public async prepare() {
    await this.abortDeviceLimitEventHandler.execute();
    const storedState = await deserialize(this.loginMachineStore);
    if (!storedState) {
      const actor = this.interpreter.start();
      await waitFor(actor, (state) => state.context.ready, {
        timeout: 30000,
      });
      return;
    }
    let actor: AuthenticationMachineInterpreter | undefined;
    await this.allowedToFail.doOne(() => {
      if (storedState.done) {
        throw new Error(
          "Restarting a machine which is already in its final state. Starting from scratch instead."
        );
      }
      actor = this.interpreter.start(storedState);
    }, "Resuming state machine");
    if (!actor) {
      actor = this.interpreter.start();
    }
    await waitFor(actor, (state) => state.context.ready);
  }
  public continue(event: AuthenticationMachineEvents) {
    this.interpreter.send(event);
  }
}
