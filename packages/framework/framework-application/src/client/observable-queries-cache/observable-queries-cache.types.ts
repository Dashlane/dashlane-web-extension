import { QueryMessage, ResultOf } from "@dashlane/framework-contracts";
import { AnyFunctionalError, Class } from "@dashlane/framework-types";
import { Observable } from "rxjs";
export interface IObservableQueriesCacheFor<
  TQ extends Class<
    QueryMessage<unknown, unknown, AnyFunctionalError>,
    unknown[]
  >
> {
  get: () => Observable<ResultOf<TQ>> | null;
  set: (query$: Observable<ResultOf<TQ>>) => void;
  invalidate: () => void;
}
