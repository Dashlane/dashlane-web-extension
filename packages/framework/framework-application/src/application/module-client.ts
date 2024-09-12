import { FactoryProvider as NestFactoryProvider } from "@nestjs/common";
import {
  AnyAppDefinition,
  AnyModuleApi,
  Client,
  ModuleClient,
} from "@dashlane/framework-contracts";
import { CqrsClient } from "../client";
import { Injectable } from "../dependency-injection";
class ModuleClientImpl<TModuleApi extends AnyModuleApi>
  implements ModuleClient<TModuleApi>
{
  public constructor(cqrsClient: CqrsClient, api: TModuleApi) {
    this.client = cqrsClient.getClient(api);
  }
  public get commands() {
    return this.client.commands;
  }
  public get queries() {
    return this.client.queries;
  }
  private client: Client<TModuleApi["commands"], TModuleApi["queries"]>;
}
export function createModuleClientsProviders<
  TAppDefinition extends AnyAppDefinition
>(appDefinition: TAppDefinition) {
  const moduleClientsProviders: Array<NestFactoryProvider> = [];
  Object.values(appDefinition).forEach((moduleDistribution) => {
    const { api } = moduleDistribution;
    const { ClientClass } = api;
    if (!ClientClass) {
      return;
    }
    Injectable()(ClientClass);
    moduleClientsProviders.push({
      provide: ClientClass,
      useFactory(cqrsClient) {
        return new ModuleClientImpl(cqrsClient, api);
      },
      inject: [CqrsClient],
    });
  });
  return moduleClientsProviders;
}
