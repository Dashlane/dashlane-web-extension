import { Slot } from "ts-event-bus";
import {
  Command,
  Commands,
  LiveQueries,
  LiveQuery,
  Queries,
  Query,
} from "Shared/Api";
export type CommandSlots<C extends Commands> = {
  readonly [name in keyof C]: C[name] extends Command<infer A, infer B>
    ? Slot<A, B>
    : never;
};
export type QuerySlots<Q extends Queries> = {
  readonly [name in keyof Q]: Q[name] extends Query<infer A, infer B>
    ? Slot<A, B>
    : never;
};
export type LiveQuerySlots<L extends LiveQueries> = {
  readonly [name in keyof L]: L[name] extends LiveQuery<infer _, infer B>
    ? Slot<B>
    : never;
};
export type BusCommands<C extends Commands> = CommandSlots<C>;
export type BusQueries<Q extends Queries> = QuerySlots<Q>;
export type BusLiveQueries<L extends LiveQueries> = LiveQuerySlots<L>;
