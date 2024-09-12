import { FactoryProvider as NestFactoryProvider } from "@nestjs/common";
import { RequestContextClient } from "@dashlane/framework-contracts";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../request-context";
import { UserUseCaseScope } from "./user-use-case-scope";
import { UseCaseScopeStatuses } from "./use-case-scope";
import { AppLifeCycle } from "../application/app-lifecycle";
let USER_SCOPE: UserUseCaseScope | undefined = undefined;
export function getUserUseCaseScopeProvider(): NestFactoryProvider {
  return {
    useFactory: (
      requestContext: RequestContext,
      requestContextClient: RequestContextClient,
      lifecycle: AppLifeCycle
    ) => {
      const userName = requestContext.get<string>(
        FrameworkRequestContextValues.UserName
      );
      if (!userName) {
        return undefined;
      }
      if (!USER_SCOPE || USER_SCOPE.status === UseCaseScopeStatuses.Closed) {
        USER_SCOPE = new UserUseCaseScope(
          userName,
          lifecycle,
          requestContextClient
        );
      }
      return Promise.resolve(USER_SCOPE);
    },
    provide: UserUseCaseScope,
    inject: [RequestContext, RequestContextClient, AppLifeCycle],
  };
}
