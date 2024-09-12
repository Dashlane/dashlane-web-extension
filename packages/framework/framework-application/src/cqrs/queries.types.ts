import { QueryMessage } from "@dashlane/framework-contracts";
import { AnyFunctionalError, Result } from "@dashlane/framework-types";
import { Observable } from "rxjs";
export type QueryHandlerResponseOf<TQuery> = TQuery extends QueryMessage<
  unknown,
  infer TSuccess,
  infer TFailure
>
  ? Observable<Result<TSuccess, TFailure>>
  : unknown;
export interface QueryInfo {
  readonly name: string;
}
export interface IQueryHandler<
  TQuery extends QueryMessage<unknown, unknown, AnyFunctionalError>
> {
  execute: (
    query: TQuery,
    queryInfo: QueryInfo
  ) => QueryHandlerResponseOf<TQuery>;
}
