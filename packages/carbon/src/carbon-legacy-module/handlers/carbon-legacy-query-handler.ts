import { shallowEqual } from "shallow-equal";
import { distinctUntilChanged, map, Observable } from "rxjs";
import { CarbonStateQuery } from "@dashlane/communication";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { isObject, Result, success } from "@dashlane/framework-types";
import { CarbonLegacyInfrastructure } from "../carbon-legacy-infrastructure";
import { getCarbonLegacyStateSelector } from "../carbon-state.selector";
@QueryHandler(CarbonStateQuery)
export class CarbonGetStateQueryHandler
  implements IQueryHandler<CarbonStateQuery>
{
  constructor(private infrastructure: CarbonLegacyInfrastructure) {}
  public execute({
    body: { path },
  }: CarbonStateQuery): Observable<Result<unknown>> {
    const { carbonState$ } = this.infrastructure;
    return carbonState$.pipe(
      map((x) => getCarbonLegacyStateSelector(x, path)),
      distinctUntilChanged((a, b) =>
        !isObject(a) || !isObject(b) ? Object.is(a, b) : shallowEqual(a, b)
      ),
      map(success)
    );
  }
}
