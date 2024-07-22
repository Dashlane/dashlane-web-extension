import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { mapSuccessObservable } from "@dashlane/framework-types";
import { SharingEnabledQuery } from "@dashlane/sharing-contracts";
import { CurrentSpaceGetterService } from "../../../sharing-carbon-helpers";
@QueryHandler(SharingEnabledQuery)
export class SharingEnabledQueryHandler
  implements IQueryHandler<SharingEnabledQuery>
{
  constructor(private currentSpaceGetter: CurrentSpaceGetterService) {}
  execute(): QueryHandlerResponseOf<SharingEnabledQuery> {
    return this.currentSpaceGetter
      .get()
      .pipe(mapSuccessObservable((space) => space.isSharingEnabled));
  }
}
