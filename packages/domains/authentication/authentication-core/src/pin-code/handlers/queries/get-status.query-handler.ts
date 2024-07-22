import { Observable } from "rxjs";
import {
  GetStatusQuery,
  GetStatusQueryResult,
} from "@dashlane/authentication-contracts";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { Result } from "@dashlane/framework-types";
import { PinCodeService } from "../../services/pin-code.service";
@QueryHandler(GetStatusQuery)
export class GetStatusQueryHandler implements IQueryHandler<GetStatusQuery> {
  constructor(private readonly pinCodeService: PinCodeService) {}
  public execute(
    query: GetStatusQuery
  ): Observable<Result<GetStatusQueryResult>> {
    return this.pinCodeService.getPinCodeStatus(query.body.loginEmail);
  }
}
