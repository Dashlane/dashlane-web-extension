import { CarbonLegacyClient } from "@dashlane/communication";
import { map } from "rxjs";
import { AuthenticationMachineInterpreter } from "../flows/main-flow/types";
export class AbortDeviceLimitEventHandler {
  private interpreter: AuthenticationMachineInterpreter;
  private carbon: CarbonLegacyClient;
  private lastDeviceLimitFlowValue: unknown;
  public constructor(
    interpreter: AuthenticationMachineInterpreter,
    carbon: CarbonLegacyClient
  ) {
    this.interpreter = interpreter;
    this.carbon = carbon;
  }
  public execute() {
    try {
      const { carbonState } = this.carbon.queries;
      carbonState({
        path: "userSession.loginDeviceLimitFlow.flow",
      })
        .pipe(
          map((state) => {
            if (state.tag === "success") {
              return state.data;
            }
          })
        )
        .subscribe((deviceLimitFlowValue) => {
          if (Boolean(this.lastDeviceLimitFlowValue) && !deviceLimitFlowValue) {
            this.interpreter.send({
              type: "DEVICE_LIMIT_ABORTED",
            });
          }
          this.lastDeviceLimitFlowValue = deviceLimitFlowValue;
        });
    } catch (error) {
      return Promise.reject(
        new Error("Unable to subscribe to loginDeviceLimitFlow state")
      );
    }
  }
}
