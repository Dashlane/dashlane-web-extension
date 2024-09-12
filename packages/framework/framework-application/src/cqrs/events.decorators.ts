import { Class, InstanceOf } from "@dashlane/framework-types";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { Type } from "@nestjs/common";
import { IEventHandler } from "./events.types";
import { EventDefinition } from "@dashlane/framework-contracts";
export function EventHandler<T extends EventDefinition>(eventType: T) {
  const injectableDecorator = Injectable();
  return (classCtor: Class<IEventHandler<InstanceOf<T>>>) => {
    if (Reflect.hasMetadata("dl-handlers", eventType)) {
      const existing = Reflect.getMetadata("dl-handlers", eventType) as Type[];
      Reflect.defineMetadata(
        "dl-handlers",
        [...existing, classCtor],
        eventType
      );
    } else {
      Reflect.defineMetadata("dl-handlers", [classCtor], eventType);
    }
    injectableDecorator(classCtor);
  };
}
