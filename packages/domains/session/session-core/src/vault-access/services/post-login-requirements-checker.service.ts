import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  timeout,
} from "rxjs";
import { shallowEqualArrays } from "shallow-equal";
import { ExceptionLogger, Injectable } from "@dashlane/framework-application";
import {
  NotAllowedReason,
  SessionClient,
  UserIsAllowed,
  UserIsNotAllowed,
} from "@dashlane/session-contracts";
import { isSuccess } from "@dashlane/framework-types";
import {
  ChangeLoginEmailChecker,
  DeviceLimitChecker,
  EnforceAccountRecoveryKeyChecker,
  EnforcePinChecker,
  EnforceTwoFactorAuthenticationChecker,
  PostLoginRequirementsChecker,
  SsoMigrationChecker,
} from "./";
function compareUserIsAllowed(
  previous: UserIsAllowed | UserIsNotAllowed,
  current: UserIsAllowed | UserIsNotAllowed
) {
  if (previous.isAllowed !== current.isAllowed) {
    return false;
  }
  if (!previous.isAllowed && !current.isAllowed) {
    return shallowEqualArrays(previous.reasons, current.reasons);
  }
  return true;
}
const userAllowed = { isAllowed: true } as const;
@Injectable()
export class PostLoginRequirementsCheckerService {
  private readonly postLoginRequirements: PostLoginRequirementsChecker[];
  constructor(
    private readonly session: SessionClient,
    private readonly exceptionLogger: ExceptionLogger,
    deviceLimitChecker: DeviceLimitChecker,
    enforceAccountRecoveryKeyChecker: EnforceAccountRecoveryKeyChecker,
    enforcePinChecker: EnforcePinChecker,
    enforceTwoFactorAuthenticationChecker: EnforceTwoFactorAuthenticationChecker,
    ssoMigrationChecker: SsoMigrationChecker,
    changeLoginEmailChecker: ChangeLoginEmailChecker
  ) {
    this.postLoginRequirements = [
      deviceLimitChecker,
      enforceAccountRecoveryKeyChecker,
      enforcePinChecker,
      enforceTwoFactorAuthenticationChecker,
      ssoMigrationChecker,
      changeLoginEmailChecker,
    ];
  }
  execute(): Observable<UserIsAllowed | UserIsNotAllowed> {
    const { selectedOpenedSession } = this.session.queries;
    const activeLogin$ = selectedOpenedSession(undefined);
    return activeLogin$.pipe(
      switchMap((activeLogin) => {
        if (!isSuccess(activeLogin)) {
          throw new Error("Failed to get active user's login");
        }
        if (!activeLogin.data) {
          return of({
            isAllowed: false,
            reasons: [NotAllowedReason.NoActiveUser],
          } satisfies UserIsNotAllowed);
        }
        const postLoginRequirements$ = this.postLoginRequirements.map(
          (postLoginRequirement) =>
            postLoginRequirement.check(activeLogin.data).pipe(
              catchError(() => {
                console.log(`${postLoginRequirement.name} query has failed`);
                this.exceptionLogger.captureException(
                  new Error(`${postLoginRequirement.name} query has failed`),
                  { useCaseName: "isAllowedQuery" }
                );
                return of([]);
              }),
              timeout({
                first: 3000,
                with: () => {
                  console.log(
                    `${postLoginRequirement.name} query has timed out`
                  );
                  this.exceptionLogger.captureException(
                    new Error(
                      `${postLoginRequirement.name} query has timed out`
                    ),
                    { useCaseName: "isAllowedQuery" }
                  );
                  return of([]);
                },
              })
            )
        );
        return combineLatest(postLoginRequirements$).pipe(
          map((requirementsResults) => {
            const requiredActions = Array.from(
              new Set(requirementsResults.flat())
            ).sort();
            if (requiredActions.length > 0) {
              return {
                isAllowed: false,
                reasons: requiredActions,
              } as UserIsNotAllowed;
            }
            return userAllowed;
          })
        );
      }),
      distinctUntilChanged(compareUserIsAllowed)
    );
  }
}
