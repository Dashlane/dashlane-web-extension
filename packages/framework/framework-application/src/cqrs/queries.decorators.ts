import { QueryDefinition } from "@dashlane/framework-contracts";
import { Class, InstanceOf } from "@dashlane/framework-types";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { IQueryHandler } from "./queries.types";
export function QueryHandler<T extends QueryDefinition>(queryType: T) {
  const injectableDecorator = Injectable();
  return (classCtor: Class<IQueryHandler<InstanceOf<T>>>) => {
    Reflect.defineMetadata("dl-handler", classCtor, queryType);
    injectableDecorator(classCtor);
  };
}
