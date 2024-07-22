import { map } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  type QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { IsSharingAllowedQuery } from "@dashlane/sharing-contracts";
import { IsSharingAllowedService } from "../common/is-sharing-allowed.service";
@QueryHandler(IsSharingAllowedQuery)
export class IsSharingAllowedQueryHandler
  implements IQueryHandler<IsSharingAllowedQuery>
{
  constructor(private isSharingAllowedService: IsSharingAllowedService) {}
  execute(): QueryHandlerResponseOf<IsSharingAllowedQuery> {
    return this.isSharingAllowedService
      .get()
      .pipe(
        map((remaining) =>
          success(typeof remaining === "boolean" ? remaining : remaining > 0)
        )
      );
  }
}
