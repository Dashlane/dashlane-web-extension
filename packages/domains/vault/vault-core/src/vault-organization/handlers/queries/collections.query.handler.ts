import {
  CollectionsQuery,
  CollectionsQueryResult,
} from "@dashlane/vault-contracts";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { Result } from "@dashlane/framework-types";
import { Observable } from "rxjs";
import { fetchCollections } from "../../data-fetching-helper";
import { CarbonLegacyClient } from "@dashlane/communication";
@QueryHandler(CollectionsQuery)
export class CollectionsQueryHandler
  implements IQueryHandler<CollectionsQuery>
{
  constructor(private carbonLegacyClient: CarbonLegacyClient) {}
  execute({
    body,
  }: CollectionsQuery): Observable<Result<CollectionsQueryResult>> {
    const { ids } = body;
    return fetchCollections(this.carbonLegacyClient, ids);
  }
}
