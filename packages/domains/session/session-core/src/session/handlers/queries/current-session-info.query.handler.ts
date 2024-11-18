import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { CurrentSessionInfoQuery } from "@dashlane/session-contracts";
import { map } from "rxjs";
import { CurrentSessionInfoRepository } from "../../services/current-session-infos.repository";
@QueryHandler(CurrentSessionInfoQuery)
export class CurrentSessionInfoQueryHandler
  implements IQueryHandler<CurrentSessionInfoQuery>
{
  constructor(private readonly repository: CurrentSessionInfoRepository) {}
  execute(): QueryHandlerResponseOf<CurrentSessionInfoQuery> {
    return this.repository.getInfos().pipe(
      map(({ analytics, deviceAccessKey, login, deviceKeys, publicUserId }) =>
        success({
          analytics,
          deviceAccessKey,
          login,
          deviceKeys,
          publicUserId,
        })
      )
    );
  }
}
