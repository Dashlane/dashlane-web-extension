import { map, Observable } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { NotAllowedReason } from "@dashlane/session-contracts";
import { CarbonLegacyClient } from "@dashlane/communication";
import { isSuccess } from "@dashlane/framework-types";
import { PostLoginRequirementsChecker } from "./post-login-requirements.types";
import { testIsDeviceLimited } from "../handlers/queries/carbon-device-limit";
import { ExceptionLoggingClient } from "@dashlane/framework-contracts";
@Injectable()
export class DeviceLimitChecker implements PostLoginRequirementsChecker {
  public readonly name = "device-limit";
  constructor(
    private readonly carbon: CarbonLegacyClient,
    private readonly anomalyReporter: ExceptionLoggingClient
  ) {}
  check(): Observable<NotAllowedReason[]> {
    const { liveLoginDeviceLimitFlow } = this.carbon.queries;
    const loginDeviceLimitFlow$ = liveLoginDeviceLimitFlow(undefined);
    return loginDeviceLimitFlow$.pipe(
      map((deviceLimitFlow) => {
        if (!isSuccess(deviceLimitFlow)) {
          console.log("loginDeviceLimitFlow query has failed");
          this.anomalyReporter.commands.reportAnomaly({
            criticality: "warning",
            message: "loginDeviceLimitFlow query has failed",
            moduleName: "vault-access",
            useCaseName: "isAllowedQuery",
            applicationComponent: "",
            anomalyType: "other",
          });
          return [];
        }
        const isDeviceLimited = testIsDeviceLimited(deviceLimitFlow.data);
        if (isDeviceLimited) {
          return [NotAllowedReason.DeviceLimited];
        }
        return [];
      })
    );
  }
}
