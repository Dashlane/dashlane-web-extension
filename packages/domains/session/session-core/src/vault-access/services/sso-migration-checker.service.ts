import { map, Observable } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { NotAllowedReason } from "@dashlane/session-contracts";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { isSuccess } from "@dashlane/framework-types";
import { SSOMigrationType } from "@dashlane/communication";
import { PostLoginRequirementsChecker } from "./post-login-requirements.types";
import { ExceptionLoggingClient } from "@dashlane/framework-contracts";
const FromMigrationToReason: Record<SSOMigrationType, NotAllowedReason> = {
  [SSOMigrationType.MP_TO_SSO]: NotAllowedReason.RequiresMP2SSOMigration,
  [SSOMigrationType.MP_TO_SSO_WITH_INFO]:
    NotAllowedReason.RequiresMP2SSOMigration,
  [SSOMigrationType.SSO_TO_MP]: NotAllowedReason.RequiresSSO2MPMigration,
};
@Injectable()
export class SsoMigrationChecker implements PostLoginRequirementsChecker {
  public readonly name = "sso-migration";
  constructor(
    private readonly authentication: AuthenticationFlowContracts.AuthenticationFlowClient,
    private readonly anomalyReporter: ExceptionLoggingClient
  ) {}
  check(): Observable<NotAllowedReason[]> {
    const { getProviderInfo } = this.authentication.queries;
    const ssoMigrationType$ = getProviderInfo(undefined);
    return ssoMigrationType$.pipe(
      map((ssoMigrationType) => {
        if (!isSuccess(ssoMigrationType)) {
          console.log("ssoMigrationType query has failed");
          this.anomalyReporter.commands.reportAnomaly({
            criticality: "warning",
            message: "ssoMigrationType query has failed",
            moduleName: "vault-access",
            useCaseName: "SsoMigrationCheckerService",
            applicationComponent: "",
            anomalyType: "other",
          });
          return [];
        }
        if (ssoMigrationType.data.migrationType !== undefined) {
          return [FromMigrationToReason[ssoMigrationType.data.migrationType]];
        }
        return [];
      })
    );
  }
}
