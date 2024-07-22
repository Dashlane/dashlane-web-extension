import {
  CanLockAppQuery,
  PinCodeClient,
} from "@dashlane/authentication-contracts";
import { CarbonLegacyClient } from "@dashlane/communication";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { isFailure, Result, success } from "@dashlane/framework-types";
import { combineLatest, distinctUntilChanged, map, Observable } from "rxjs";
@QueryHandler(CanLockAppQuery)
export class CanLockAppQueryHandler implements IQueryHandler<CanLockAppQuery> {
  constructor(
    private readonly carbon: CarbonLegacyClient,
    private readonly pinCode: PinCodeClient
  ) {}
  execute(): Observable<Result<boolean>> {
    const isWebauthnEnabledQuery$ =
      this.carbon.queries.liveWebAuthnAuthenticationOptedIn(undefined);
    const isPinCodeEnabledQuery$ = this.pinCode.queries.getCurrentUserStatus();
    return combineLatest({
      webAuthnQuery: isWebauthnEnabledQuery$,
      pinCodeQuery: isPinCodeEnabledQuery$,
    }).pipe(
      map(({ pinCodeQuery, webAuthnQuery }) => {
        if (isFailure(pinCodeQuery) || isFailure(webAuthnQuery)) {
          throw new Error("failed to query");
        }
        return pinCodeQuery.data.isPinCodeEnabled || webAuthnQuery.data;
      }),
      distinctUntilChanged(),
      map(success)
    );
  }
}
