import { map } from "rxjs";
import {
  FrameworkRequestContextValues,
  IQueryHandler,
  QueryHandler,
  RequestContext,
} from "@dashlane/framework-application";
import { GetSharedCollectionsCountQuery } from "@dashlane/sharing-contracts";
import { success } from "@dashlane/framework-types";
import { SharedCollectionsRepository } from "../common/shared-collections.repository";
@QueryHandler(GetSharedCollectionsCountQuery)
export class GetSharedCollectionsCountQueryHandler
  implements IQueryHandler<GetSharedCollectionsCountQuery>
{
  constructor(
    private collectionsRepository: SharedCollectionsRepository,
    private context: RequestContext
  ) {}
  execute() {
    const allCollections$ = this.collectionsRepository.collections$();
    const currentUserLogin = this.getCurrentUserLogin();
    return allCollections$.pipe(
      map((collections) => {
        const sharedCollectionsByUser = collections.filter(
          (collection) => collection.authorLogin === currentUserLogin
        );
        return success(sharedCollectionsByUser.length);
      })
    );
  }
  getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
}
