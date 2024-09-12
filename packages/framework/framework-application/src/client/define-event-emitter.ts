import {
  AnyAppDefinition,
  AnyModuleApi,
  BodyOfEvent,
} from "@dashlane/framework-contracts";
import { Inject } from "@nestjs/common";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { ModuleApiNameProviderToken } from "../dependency-injection/module.internal";
import { NodeEventBroker } from "./node-event-broker";
import { RequestContext } from "../request-context/request-context";
export interface EventEmitter<TApi extends AnyModuleApi> {
  sendEvent: <TEventName extends string & keyof TApi["events"]>(
    name: TEventName,
    event: BodyOfEvent<TApi["events"][TEventName]>
  ) => Promise<void>;
}
@Injectable()
export class BaseEventEmitter<TApi extends AnyModuleApi> {
  constructor(
    @Inject(ModuleApiNameProviderToken)
    private apiName: TApi["name"],
    private broker: NodeEventBroker<AnyAppDefinition, string>,
    private context: RequestContext
  ) {}
  public sendEvent<TEventName extends string & keyof TApi["events"]>(
    name: TEventName,
    event: BodyOfEvent<TApi["events"][TEventName]>
  ): Promise<void> {
    return this.broker.publishEvent(this.apiName, name, event, this.context);
  }
}
@Injectable()
export class ContextlessBaseEventEmitter<TApi extends AnyModuleApi> {
  constructor(
    @Inject(ModuleApiNameProviderToken)
    private apiName: TApi["name"],
    private broker: NodeEventBroker<AnyAppDefinition, string>
  ) {}
  public sendEvent<TEventName extends string & keyof TApi["events"]>(
    name: TEventName,
    event: BodyOfEvent<TApi["events"][TEventName]>,
    context?: RequestContext
  ): Promise<void> {
    return this.broker.publishEvent(
      this.apiName,
      name,
      event,
      context ?? new RequestContext()
    );
  }
}
