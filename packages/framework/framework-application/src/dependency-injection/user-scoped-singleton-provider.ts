import { ContextIdFactory, ModuleRef, REQUEST } from "@nestjs/core";
import { v4 } from "uuid";
import { AsyncProvider, InjectionToken, Provider } from "./module.types";
import { Mutex } from "async-mutex";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../request-context/request-context";
import { UserUseCaseScope } from "../use-case-scope/user-use-case-scope";
export const userScopedSingletonProvider = (
  token: InjectionToken,
  baseProvider: Omit<AsyncProvider, "token"> & {
    token?: InjectionToken;
  }
): Provider[] => {
  const baseToken = baseProvider.token ?? v4();
  class InstanceCache {
    private readonly instances = new Map<string, unknown>();
    private readonly mutex: Mutex = new Mutex();
    public getOrCreate(
      key: string,
      factory: () => Promise<unknown>,
      userScope: UserUseCaseScope
    ): Promise<unknown> {
      return this.mutex.runExclusive(async () => {
        const value = this.instances.get(key);
        if (value) {
          return value;
        }
        userScope.addCloseHook(() => {
          this.invalidate(key);
        });
        const newInstance = await factory();
        this.instances.set(key, newInstance);
        return newInstance;
      });
    }
    public invalidate(key: string) {
      this.instances.delete(key);
    }
  }
  const cacheProvider = InstanceCache;
  const factoryProvider: AsyncProvider = {
    token,
    inject: [
      InstanceCache,
      RequestContext,
      ModuleRef,
      REQUEST,
      UserUseCaseScope,
    ],
    asyncFactory: (
      cache: InstanceCache,
      requestContext: RequestContext,
      ref: ModuleRef,
      request: Record<string, never>,
      userScope?: UserUseCaseScope
    ) => {
      const contextId = ContextIdFactory.getByRequest(request);
      const userName = requestContext.getOrDefault<string>(
        FrameworkRequestContextValues.UserName,
        ""
      );
      if (userName === "") {
        throw new Error(
          `Provider ${token} is a user-scoped singleton but there is no user`
        );
      }
      if (!userScope) {
        throw new Error("No user scope available");
      }
      return cache.getOrCreate(
        userName,
        () => ref.resolve(baseToken, contextId),
        userScope
      );
    },
  };
  return [
    {
      token: baseToken,
      asyncFactory: baseProvider.asyncFactory,
      inject: [...(baseProvider.inject ?? []), RequestContext],
    },
    cacheProvider,
    factoryProvider,
  ];
};
