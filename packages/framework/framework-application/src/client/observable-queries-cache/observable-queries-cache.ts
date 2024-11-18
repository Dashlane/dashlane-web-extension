import { Observable } from "rxjs";
import { AnyAppDefinition, UseCaseScope } from "@dashlane/framework-contracts";
import { AnyFunctionalError, Result } from "@dashlane/framework-types";
import { AppLifeCycle } from "../../application/app-lifecycle";
import { ObservableQueriesCacheFor } from "./observable-queries-cache-for";
import { ObservableQueriesCacheBase } from "./observable-queries-cache.base";
export class ObservableQueriesCache<
  TAppDefinition extends AnyAppDefinition
> extends ObservableQueriesCacheBase<TAppDefinition> {
  public constructor(private readonly lifeCycle: AppLifeCycle) {
    super();
    this.lifeCycle.addShutdownHook(() => {
      this.deviceCache.clear();
      this.userCache.clear();
    });
  }
  public for(
    definition: TAppDefinition,
    apiName: string,
    queryName: string,
    queryBody: unknown
  ) {
    const { scope } = definition[apiName].api.queries[queryName].metadata;
    const cache =
      scope === UseCaseScope.Device ? this.deviceCache : this.userCache;
    return new ObservableQueriesCacheFor(apiName, queryName, queryBody, cache);
  }
  public clearUserCache() {
    this.userCache.clear();
  }
  private deviceCache = new Map<
    string,
    WeakRef<Observable<Result<unknown, AnyFunctionalError>>>
  >();
  private userCache = new Map<
    string,
    WeakRef<Observable<Result<unknown, AnyFunctionalError>>>
  >();
}
