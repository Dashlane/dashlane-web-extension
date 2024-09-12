import { CommandDefinition } from "@dashlane/framework-contracts";
import { Class, InstanceOf } from "@dashlane/framework-types";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { ICommandHandler } from "./commands.types";
export function CommandHandler<T extends CommandDefinition>(commandType: T) {
  const injectableDecorator = Injectable();
  return (handlerCtor: Class<ICommandHandler<InstanceOf<T>>>) => {
    Reflect.defineMetadata("dl-handler", handlerCtor, commandType);
    injectableDecorator(handlerCtor);
  };
}
