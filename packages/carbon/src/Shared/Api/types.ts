import { Observable } from "rxjs";
import { CoreServices } from "Services";
import { State } from "Store/types";
export type RequestType<M> = M extends Command<infer T, unknown>
  ? T
  : M extends Query<infer T, unknown>
  ? T
  : M extends LiveQuery<infer T, unknown>
  ? T
  : never;
export type ResultType<M> = M extends Command<unknown, infer U>
  ? U
  : M extends Query<unknown, infer U>
  ? U
  : M extends LiveQuery<unknown, infer U>
  ? U
  : never;
export type Command<T, U> = (dto: T) => Promise<U>;
export type CommandHandler<C extends Command<unknown, unknown>> = (
  services: CoreServices,
  dto: RequestType<C>
) => Promise<ResultType<C>>;
export interface Commands {
  [command: string]: Command<any, any>;
}
export type Query<T, U> = (dto: T) => Promise<U>;
export type QuerySelector<Q extends Query<unknown, unknown>> = (
  state: State,
  dto: RequestType<Q>
) => Promise<ResultType<Q>> | ResultType<Q>;
export type StaticDataHandler<Q extends Query<unknown, unknown>> = (
  dto: RequestType<Q>
) => ResultType<Q>;
export interface Queries {
  [query: string]: Query<any, any>;
}
export type LiveQuery<T, U> = (dto: T) => Observable<U>;
export interface LiveQueries {
  [liveQuery: string]: LiveQuery<any, any>;
}
