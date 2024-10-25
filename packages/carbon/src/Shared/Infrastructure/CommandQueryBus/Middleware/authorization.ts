import { CommandBusMiddleware } from "Shared/Infrastructure/CommandQueryBus/types";
export const authorizationMiddleware: CommandBusMiddleware<any> =
  (next) => async (ctxPromise) => {
    const ctx = await ctxPromise;
    const {
      config: { allowedPlatforms },
      services: { storeService },
    } = ctx;
    const { platformName } = storeService.getPlatformInfo();
    if (allowedPlatforms && !allowedPlatforms.includes(platformName)) {
      throw new Error("You are not allowed to connect to this slot");
    }
    return await next(ctxPromise);
  };
