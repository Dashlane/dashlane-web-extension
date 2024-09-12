import {
  Global as NestGlobal,
  Injectable as NestInjectable,
  Scope,
} from "@nestjs/common";
import { InjectableParameters } from "./module.types";
export function Global(): ClassDecorator {
  return NestGlobal();
}
export function Injectable(params?: InjectableParameters): ClassDecorator {
  return NestInjectable({
    scope: params?.neverReuseInstance ? Scope.TRANSIENT : Scope.DEFAULT,
  });
}
export const FrameworkInit = () => Injectable();
