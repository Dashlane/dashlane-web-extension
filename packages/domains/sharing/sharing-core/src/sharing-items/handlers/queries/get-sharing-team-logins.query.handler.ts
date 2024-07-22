import { of, switchMap } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  getSuccess,
  isFailure,
  mapFailureObservable,
  mapSuccessObservable,
  success,
} from "@dashlane/framework-types";
import { GetSharingTeamLoginsQuery } from "@dashlane/sharing-contracts";
import { CurrentSpaceGetterService } from "../../../sharing-carbon-helpers";
@QueryHandler(GetSharingTeamLoginsQuery)
export class GetSharingTeamLoginsQueryHandler
  implements IQueryHandler<GetSharingTeamLoginsQuery>
{
  constructor(
    private serverApiClient: ServerApiClient,
    private premiumSpaceGetter: CurrentSpaceGetterService
  ) {}
  execute(): QueryHandlerResponseOf<GetSharingTeamLoginsQuery> {
    return this.premiumSpaceGetter.get().pipe(
      switchMap((premiumSpace) => {
        if (isFailure(premiumSpace)) {
          throw new Error("Error retrieving space for user");
        }
        if (!getSuccess(premiumSpace).teamId) {
          return of(success({ userLogins: [] }));
        }
        return this.serverApiClient.v1.sharingUserdevice.getTeamLogins().pipe(
          mapSuccessObservable((response) => {
            return { userLogins: response.data.teamLogins };
          }),
          mapFailureObservable((serverError) => {
            throw serverError;
          })
        );
      })
    );
  }
}
