import {
  PinCodeClient,
  UserVerificationMethods,
  UserVerificationMethodsQuery,
} from "@dashlane/authentication-contracts";
import { CarbonLegacyClient } from "@dashlane/communication";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { isSuccess, Result, success } from "@dashlane/framework-types";
import { combineLatest, filter, map, Observable, of, switchMap } from "rxjs";
@QueryHandler(UserVerificationMethodsQuery)
export class UserVerificationMethodsQueryHandler
  implements IQueryHandler<UserVerificationMethodsQuery>
{
  constructor(
    private readonly pin: PinCodeClient,
    private readonly carbon: CarbonLegacyClient
  ) {}
  execute(): Observable<Result<UserVerificationMethods[]>> {
    const hasBiometrics$ = this.carbon.queries
      .liveWebAuthnAuthenticationOptedIn(undefined)
      .pipe(
        filter(isSuccess),
        map((f) => f.data)
      );
    const isSsoUser$ = this.carbon.queries.liveIsSSOUser(undefined).pipe(
      filter(isSuccess),
      map((d) => d.data)
    );
    const isMpUser$ = isSsoUser$.pipe(
      switchMap((isSsoUser) =>
        isSsoUser
          ? of(false)
          : this.carbon.queries.getAccountAuthenticationType().pipe(
              filter(isSuccess),
              map((f) => f.data === "masterPassword")
            )
      )
    );
    const isPinCodeEnabled$ = this.pin.queries.getCurrentUserStatus().pipe(
      filter(isSuccess),
      map((f) => f.data.isPinCodeEnabled)
    );
    const isPasswordlessUser$ = combineLatest({
      isMpUser: isMpUser$,
      isPinCodeEnabled: isPinCodeEnabled$,
    }).pipe(
      map(({ isMpUser, isPinCodeEnabled }) =>
        success(!isMpUser && isPinCodeEnabled)
      ),
      filter(isSuccess),
      map((d) => d.data)
    );
    return combineLatest({
      hasBiometrics: hasBiometrics$,
      isPasswordlessUser: isPasswordlessUser$,
      isMpUser: isMpUser$,
    }).pipe(
      map(({ hasBiometrics, isPasswordlessUser, isMpUser }) =>
        success([
          ...(hasBiometrics ? [UserVerificationMethods.Biometrics] : []),
          ...(isPasswordlessUser ? [UserVerificationMethods.Pin] : []),
          ...(isMpUser ? [UserVerificationMethods.MasterPassword] : []),
        ])
      )
    );
  }
}
