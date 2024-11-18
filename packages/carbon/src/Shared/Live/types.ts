import { OperatorFunction } from "rxjs";
import { State } from "Store/types";
export type StateOperator<T> = OperatorFunction<State, T>;
