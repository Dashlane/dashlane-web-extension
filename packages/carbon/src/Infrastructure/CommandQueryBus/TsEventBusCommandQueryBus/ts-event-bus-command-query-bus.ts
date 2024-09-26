import { Observable } from "rxjs";
import { createEventBus } from "ts-event-bus";
import { CarbonServices } from "Services";
import {
  Command,
  Commands,
  LiveQueries,
  LiveQuery,
  Queries,
  Query,
  RequestType,
  ResultType,
} from "Shared/Api";
import { CommandQueryBus } from "Shared/Infrastructure";
import { connectLazySlot } from "Api/Live/lazy-slot";
import {
  CommandSlots,
  LiveQuerySlots,
  QuerySlots,
} from "Infrastructure/CommandQueryBus/TsEventBusCommandQueryBus/types";
export class TsEventBusCommandQueryBus<
  C extends Commands,
  Q extends Queries,
  L extends LiveQueries
> extends CommandQueryBus {
  public constructor(
    carbonServices: CarbonServices,
    definitions: CommandSlots<C> & QuerySlots<Q> & LiveQuerySlots<L>,
    private bus?: CommandSlots<C> & QuerySlots<Q> & LiveQuerySlots<L>
  ) {
    super(carbonServices);
    if (!bus) {
      this.bus = createEventBus({
        events: definitions,
      });
    }
  }
  protected registerCommand<C extends Command<unknown, unknown>>(
    name: string,
    handler: (r: RequestType<C>) => Promise<ResultType<C>>
  ) {
    this.bus[name].on(handler);
  }
  protected registerQuery<Q extends Query<unknown, unknown>>(
    name: string,
    handler: (r: RequestType<Q>) => Promise<ResultType<Q>>
  ) {
    this.bus[name].on(handler);
  }
  protected registerLiveQuery<L extends LiveQuery<unknown, unknown>>(
    name: string,
    liveHandler: (r: RequestType<L> & string) => Observable<ResultType<L>>
  ) {
    connectLazySlot(this.bus[name], liveHandler);
  }
}
