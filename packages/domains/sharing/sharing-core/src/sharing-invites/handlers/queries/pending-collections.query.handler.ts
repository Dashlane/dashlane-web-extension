import {
  FrameworkRequestContextValues,
  IQueryHandler,
  QueryHandler,
  RequestContext,
} from "@dashlane/framework-application";
import { GetPendingCollectionsQuery } from "@dashlane/sharing-contracts";
import { PendingCollectionsStore } from "../../store/pending-collections.store";
import { success } from "@dashlane/framework-types";
import { map } from "rxjs";
import { getPendingCollectionsQueryObjects } from "./helpers";
@QueryHandler(GetPendingCollectionsQuery)
export class PendingCollectionsQueryHandler
  implements IQueryHandler<GetPendingCollectionsQuery>
{
  constructor(
    private store: PendingCollectionsStore,
    private context: RequestContext
  ) {}
  execute() {
    const currentUserLogin = this.getCurrentUserLogin();
    if (currentUserLogin === undefined) {
      throw new Error(
        "Unable to get pending collections, user login not found"
      );
    }
    return this.store.state$.pipe(
      map((state) => {
        const pendingCollections = getPendingCollectionsQueryObjects(
          state.pendingCollections,
          currentUserLogin
        );
        return success(pendingCollections);
      })
    );
  }
  getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
}
