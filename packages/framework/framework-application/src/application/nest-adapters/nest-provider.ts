import {
  ClassProvider as NestClassProvider,
  FactoryProvider as NestFactoryProvider,
  ValueProvider as NestValueProvider,
} from "@nestjs/common";
import { assertUnreachable } from "@dashlane/framework-types";
import {
  ParameterProvider,
  ParameterProviderType,
} from "../../dependency-injection/parameter-provider.types";
import { InjectionToken } from "../../dependency-injection/module.types";
export function parameterProviderToNestProvider<T = unknown>(params: {
  token: InjectionToken;
  parameterProvider: ParameterProvider<T>;
}): NestClassProvider | NestFactoryProvider | NestValueProvider {
  const { parameterProvider, token } = params;
  switch (parameterProvider.type) {
    case ParameterProviderType.CLASS_PROVIDER: {
      return {
        provide: token,
        useClass: parameterProvider.useClass,
      };
    }
    case ParameterProviderType.VALUE_PROVIDER: {
      return {
        provide: token,
        useValue: parameterProvider.useValue,
      };
    }
    default:
      assertUnreachable(parameterProvider);
  }
}
