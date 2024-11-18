import { QueryMessage, ResultOf } from "@dashlane/framework-contracts";
import { AnyFunctionalError, Class } from "@dashlane/framework-types";
import { Observable } from "rxjs";
import { IObservableQueriesCacheFor } from "./observable-queries-cache.types";
export class ObservableQueriesCacheFor<
  TQ extends Class<QueryMessage<unknown, unknown, AnyFunctionalError>, any>
> implements IObservableQueriesCacheFor<TQ>
{
  constructor(
    private apiName: string,
    private queryName: string,
    private queryBody: unknown,
    private cache: Map<string, WeakRef<Observable<ResultOf<TQ>>>>
  ) {
    this.key = this.initCacheKey();
  }
  public get(): Observable<ResultOf<TQ>> | null {
    const { key } = this;
    if (this.cache.has(key)) {
      const cachedQuery$ = this.cache.get(key)?.deref();
      if (cachedQuery$) {
        return cachedQuery$;
      }
    }
    return null;
  }
  public set(query$: Observable<ResultOf<TQ>>) {
    const { key } = this;
    this.cache.set(key, new WeakRef(query$));
  }
  public invalidate() {
    const { key } = this;
    this.cache.delete(key);
  }
  private initCacheKey() {
    const { apiName, queryName, queryBody } = this;
    return `${apiName}#${queryName}#${JSON.stringify(queryBody)}`;
  }
  private key: string;
}
