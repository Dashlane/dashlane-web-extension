import { map, Observable } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { NotAllowedReason } from "@dashlane/session-contracts";
import { AccountManagementClient } from "@dashlane/account-contracts";
import { isSuccess } from "@dashlane/framework-types";
import { ExceptionLoggingClient } from "@dashlane/framework-contracts";
import { PostLoginRequirementsChecker } from "./post-login-requirements.types";
@Injectable()
export class ChangeLoginEmailChecker implements PostLoginRequirementsChecker {
  public readonly name = "change-login-email";
  constructor(
    private readonly accountManagement: AccountManagementClient,
    private readonly anomalyReporter: ExceptionLoggingClient
  ) {}
  check(): Observable<NotAllowedReason[]> {
    return this.accountManagement.queries.pendingLoginChangeRequests().pipe(
      map((pendingRequests) => {
        if (!isSuccess(pendingRequests)) {
          console.log("pendingLoginChangeRequests query has failed");
          this.anomalyReporter.commands.reportAnomaly({
            criticality: "warning",
            message: "pendingLoginChangeRequests query has failed",
            moduleName: "vault-access",
            useCaseName: "ChangeLoginEmailCheckerService",
            applicationComponent: "",
            anomalyType: "other",
          });
          return [];
        }
        if (pendingRequests.data.length > 0) {
          return [NotAllowedReason.RequiresChangeLoginEmail];
        }
        return [];
      })
    );
  }
}
