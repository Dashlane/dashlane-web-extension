import { ContextIdFactory, ModuleRef, REQUEST } from "@nestjs/core";
import { v4 } from "uuid";
import { Injectable } from "./injectable.decorator";
import { AsyncProvider, InjectionToken, Provider } from "./module.types";
import { Mutex } from "async-mutex";
import { AppLifeCycle } from "../application/app-lifecycle";
export const deviceScopedSingletonProvider = (
  token: InjectionToken,
  baseProvider: Omit<AsyncProvider, "token"> & {
    token?: InjectionToken;
  }
): Provider[] => {
  const baseToken = baseProvider.token ?? v4();
  class InstanceCache {
    private instance: unknown;
    private readonly mutex: Mutex = new Mutex();
    public getOrCreate(
      factory: () => Promise<unknown>,
      lifeCycle: AppLifeCycle
    ): Promise<unknown> {
      return this.mutex.runExclusive(async () => {
        if (this.instance) {
          return this.instance;
        }
        lifeCycle.addShutdownHook(() => {
          this.invalidate();
        });
        this.instance = await factory();
        return this.instance;
      });
    }
    public invalidate() {
      this.instance = undefined;
    }
  }
  Injectable()(InstanceCache);
  const cacheProvider = InstanceCache;
  const factoryProvider: AsyncProvider = {
    token,
    inject: [InstanceCache, AppLifeCycle, ModuleRef, REQUEST],
    asyncFactory: (
      cache: InstanceCache,
      lifeCycle: AppLifeCycle,
      ref: ModuleRef,
      request: Record<string, never>
    ) => {
      const contextId = ContextIdFactory.getByRequest(request);
      return cache.getOrCreate(
        () => ref.resolve(baseToken, contextId),
        lifeCycle
      );
    },
  };
  return [
    {
      ...baseProvider,
      token: baseToken,
    },
    cacheProvider,
    factoryProvider,
  ];
};
