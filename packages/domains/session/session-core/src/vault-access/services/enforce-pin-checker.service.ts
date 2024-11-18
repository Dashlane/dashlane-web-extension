import { combineLatest, map, Observable } from "rxjs";
import { PinCodeClient } from "@dashlane/authentication-contracts";
import { Injectable } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { NotAllowedReason } from "@dashlane/session-contracts";
import {
  AccountAuthenticationType,
  CarbonLegacyClient,
} from "@dashlane/communication";
import { PostLoginRequirementsChecker } from "./post-login-requirements.types";
import { ExceptionLoggingClient } from "@dashlane/framework-contracts";
const ENFORCE_PIN_FOR: Record<AccountAuthenticationType, boolean> = {
  masterPassword: false,
  invisibleMasterPassword: true,
};
@Injectable()
export class EnforcePinChecker implements PostLoginRequirementsChecker {
  public readonly name = "enforce-pin";
  constructor(
    private readonly carbon: CarbonLegacyClient,
    private readonly pinCode: PinCodeClient,
    private readonly anomalyReporter: ExceptionLoggingClient
  ) {}
  check(login?: string): Observable<NotAllowedReason[]> {
    if (!login) {
      throw new Error("No user login provided");
    }
    const { getAccountAuthenticationType } = this.carbon.queries;
    const accountAuthenticationType$ = getAccountAuthenticationType();
    const pinCodeStatus$ = this.pinCode.queries.getCurrentUserStatus();
    return combineLatest({
      accountAuthenticationType: accountAuthenticationType$,
      pinCodeStatus: pinCodeStatus$,
    }).pipe(
      map(({ accountAuthenticationType, pinCodeStatus }) => {
        if (
          !isSuccess(accountAuthenticationType) ||
          !isSuccess(pinCodeStatus)
        ) {
          console.log(
            "One of these queries has failed: [accountAuthenticationType, pinCodeStatus]"
          );
          this.anomalyReporter.commands.reportAnomaly({
            criticality: "warning",
            message:
              "One of these queries has failed: [accountAuthenticationType, pinCodeStatus]",
            moduleName: "vault-access",
            useCaseName: "isAllowedQuery",
            applicationComponent: "",
            anomalyType: "other",
          });
          return [];
        }
        const shouldEnforcePinCode =
          ENFORCE_PIN_FOR[accountAuthenticationType.data] &&
          !pinCodeStatus.data.isPinCodeEnabled;
        if (shouldEnforcePinCode) {
          return [NotAllowedReason.RequiresSettingUpPin];
        }
        return [];
      })
    );
  }
}
