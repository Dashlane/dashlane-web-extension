import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { Result } from "@dashlane/framework-types";
import {
  CheckSessionKeyQuery,
  CheckSessionSessionNotCreated,
  SessionKeyChecker,
} from "@dashlane/session-contracts";
import { from, Observable } from "rxjs";
@QueryHandler(CheckSessionKeyQuery)
export class CheckSessionKeyQueryHandler
  implements IQueryHandler<CheckSessionKeyQuery>
{
  constructor(private checker: SessionKeyChecker) {}
  execute({
    body: { email, sessionKey },
  }: CheckSessionKeyQuery): Observable<
    Result<boolean, CheckSessionSessionNotCreated>
  > {
    return from(this.checker.checkSessionKey(email, sessionKey));
  }
}
