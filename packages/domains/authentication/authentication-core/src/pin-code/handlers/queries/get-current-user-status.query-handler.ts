import { Observable } from "rxjs";
import {
  GetCurrentUserStatusQuery,
  GetCurrentUserStatusQueryResult,
} from "@dashlane/authentication-contracts";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { Result } from "@dashlane/framework-types";
import { PinCodeService } from "../../services/pin-code.service";
@QueryHandler(GetCurrentUserStatusQuery)
export class GetCurrentUserStatusQueryHandler
  implements IQueryHandler<GetCurrentUserStatusQuery>
{
  constructor(private readonly pinCodeService: PinCodeService) {}
  public execute(): Observable<Result<GetCurrentUserStatusQueryResult>> {
    return this.pinCodeService.getCurrentUserPinCodeStatus();
  }
}
