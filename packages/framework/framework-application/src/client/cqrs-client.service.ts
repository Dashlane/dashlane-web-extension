import {
  AnyAppDefinition,
  AnyModuleApi,
  ApisNamesOf,
  Client,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { NodeConfiguration } from "../messaging/node-configuration";
import { CqrsBroker } from "./cqrs-broker";
import { createCqrsClient } from "./create-cqrs-clients";
import { RequestContext } from "../request-context/request-context";
@Injectable()
export class CqrsClient<
  TAppDefinition extends AnyAppDefinition = AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> = NodeIdentifiersOf<TAppDefinition>
> {
  constructor(
    private broker: CqrsBroker<TAppDefinition, TCurrentNode>,
    private configuration: NodeConfiguration<TAppDefinition, TCurrentNode>,
    private context: RequestContext
  ) {}
  public getClient<TApi extends AnyModuleApi>(
    api: TApi
  ): Client<TApi["commands"], TApi["queries"]> {
    const client = createCqrsClient<
      TAppDefinition,
      TCurrentNode,
      ApisNamesOf<TAppDefinition>
    >(
      this.configuration.appDefinition,
      this.broker,
      api.name as ApisNamesOf<TAppDefinition>,
      this.context
    );
    return client;
  }
}
@Injectable()
export class ContextLessCqrsClient<
  TAppDefinition extends AnyAppDefinition = AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> = NodeIdentifiersOf<TAppDefinition>
> {
  constructor(
    private configuration: NodeConfiguration<TAppDefinition, TCurrentNode>,
    private broker: CqrsBroker<TAppDefinition, TCurrentNode>
  ) {}
  public getClient<TApi extends AnyModuleApi>(
    api: TApi
  ): Client<TApi["commands"], TApi["queries"]> {
    const client = createCqrsClient<
      TAppDefinition,
      TCurrentNode,
      ApisNamesOf<TAppDefinition>
    >(
      this.configuration.appDefinition,
      this.broker,
      api.name as ApisNamesOf<TAppDefinition>
    );
    return client;
  }
}
