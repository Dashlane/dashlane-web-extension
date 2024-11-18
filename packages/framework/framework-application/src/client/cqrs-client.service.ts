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
import { ObservableQueriesCacheBase } from "./observable-queries-cache";
import { RequestContext } from "../request-context/request-context";
@Injectable()
export class CqrsClient<
  TAppDefinition extends AnyAppDefinition = AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> = NodeIdentifiersOf<TAppDefinition>
> {
  constructor(
    private broker: CqrsBroker<TAppDefinition, TCurrentNode>,
    private configuration: NodeConfiguration<TAppDefinition, TCurrentNode>,
    private context: RequestContext,
    private readonly queriesCache: ObservableQueriesCacheBase<TAppDefinition>
  ) {}
  public getClient<TApi extends AnyModuleApi>(
    api: TApi
  ): Client<TApi["commands"], TApi["queries"]> {
    return createCqrsClient<
      TAppDefinition,
      ApisNamesOf<TAppDefinition>,
      TCurrentNode
    >(
      this.configuration.currentNode,
      this.configuration.appDefinition,
      this.broker,
      api.name as ApisNamesOf<TAppDefinition>,
      this.queriesCache,
      this.context
    );
  }
}
@Injectable()
export class ContextLessCqrsClient<
  TAppDefinition extends AnyAppDefinition = AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition> | null = NodeIdentifiersOf<TAppDefinition>
> {
  constructor(
    private configuration: NodeConfiguration<TAppDefinition, TCurrentNode>,
    private broker: CqrsBroker<TAppDefinition, TCurrentNode>,
    private readonly queriesCache: ObservableQueriesCacheBase<TAppDefinition>
  ) {}
  public getClient<TApi extends AnyModuleApi>(
    api: TApi
  ): Client<TApi["commands"], TApi["queries"]> {
    return createCqrsClient<
      TAppDefinition,
      ApisNamesOf<TAppDefinition>,
      TCurrentNode
    >(
      this.configuration.currentNode,
      this.configuration.appDefinition,
      this.broker,
      api.name as ApisNamesOf<TAppDefinition>,
      this.queriesCache
    );
  }
}
