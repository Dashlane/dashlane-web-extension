import { distinctUntilChanged, map, Observable } from "rxjs";
import { shallowEqual } from "shallow-equal";
import { CarbonStateListQuery } from "@dashlane/communication";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { Result, success } from "@dashlane/framework-types";
import { CarbonLegacyInfrastructure } from "../carbon-legacy-infrastructure";
import { getCarbonLegacyStateSelector } from "../carbon-state.selector";
@QueryHandler(CarbonStateListQuery)
export class CarbonStateListQueryHandler
  implements IQueryHandler<CarbonStateListQuery>
{
  constructor(private infrastructure: CarbonLegacyInfrastructure) {}
  public execute({
    body: { paths },
  }: CarbonStateListQuery): Observable<Result<unknown[]>> {
    const { carbonState$ } = this.infrastructure;
    return carbonState$.pipe(
      map((x) => paths.map((path) => getCarbonLegacyStateSelector(x, path))),
      distinctUntilChanged(shallowEqual),
      map(success)
    );
  }
}
