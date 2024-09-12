import { EventMessage } from "@dashlane/framework-contracts";
export abstract class IEventHandler<TEvent extends EventMessage<unknown>> {
  abstract handle(event: TEvent): Promise<void>;
}
