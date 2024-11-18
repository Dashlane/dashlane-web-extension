import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import {
  IsPinCodeCorrectQuery,
  IsPinCodeCorrectQueryResult,
} from "@dashlane/authentication-contracts";
import { SessionClient } from "@dashlane/session-contracts";
import { isSuccess, Result } from "@dashlane/framework-types";
import { Observable, switchMap } from "rxjs";
import { PinCodeService } from "../../services/pin-code.service";
@QueryHandler(IsPinCodeCorrectQuery)
export class IsPinCodeCorrectQueryHandler
  implements IQueryHandler<IsPinCodeCorrectQuery>
{
  constructor(
    private readonly pinCodeService: PinCodeService,
    private readonly session: SessionClient
  ) {}
  execute(
    query: IsPinCodeCorrectQuery
  ): Observable<Result<IsPinCodeCorrectQueryResult>> {
    const currentUser$ = this.session.queries.selectedOpenedSession();
    return currentUser$.pipe(
      switchMap(async (login) => {
        if (!isSuccess(login) || !login.data) {
          throw new Error("No user logged in");
        }
        return await this.pinCodeService.validatePinCode(
          query.body.pinCode,
          login.data
        );
      })
    );
  }
}
