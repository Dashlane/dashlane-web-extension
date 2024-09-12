import { UseCaseScope } from "@dashlane/framework-contracts";
import { assertUnreachable } from "@dashlane/framework-types";
import { deviceScopedSingletonProvider } from "./device-scoped-singleton-provider";
import { AsyncProvider, InjectionToken, Provider } from "./module.types";
import { userScopedSingletonProvider } from "./user-scoped-singleton-provider";
export const scopedSingleton = (
  scope: UseCaseScope,
  token: InjectionToken,
  baseProvider: AsyncProvider
): Provider[] => {
  switch (scope) {
    case UseCaseScope.Device:
      return deviceScopedSingletonProvider(token, baseProvider);
    case UseCaseScope.User:
      return userScopedSingletonProvider(token, baseProvider);
    default:
      assertUnreachable(scope);
  }
};
