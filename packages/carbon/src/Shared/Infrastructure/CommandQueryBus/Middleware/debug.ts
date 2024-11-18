import { CommandBusMiddleware } from "Shared/Infrastructure/CommandQueryBus/types";
import { logWarn } from "Logs/Debugger/console";
const DO_DEBUG = false;
const debugIds = new Map<string, number>();
export const perfDebugMiddleware: CommandBusMiddleware<any> =
  (next) => async (ctxPromise) => {
    if (!DO_DEBUG) {
      return next(ctxPromise);
    }
    const ctx = await ctxPromise;
    const { arg, logTags, messageName } = ctx;
    const prefix = logTags.map((t) => `[${t}]`).join(" ");
    const prevReqId = debugIds.get(messageName);
    const reqId = prevReqId === undefined ? 0 : prevReqId + 1;
    debugIds.set(messageName, reqId);
    const reqTag = `${prefix} ${messageName} #${reqId}`;
    console.time(reqTag);
    try {
      const ctxAfter = await next(ctxPromise);
      console.timeEnd(reqTag);
      return ctxAfter;
    } catch (error) {
      logWarn({
        message: `Request ${reqId} on ${messageName} failed`,
        tag: logTags,
        details: {
          arg,
          error,
        },
      });
      console.timeEnd(reqTag);
      throw error;
    }
  };
let VERBOSE_CARBON_BUS_LOGS = true;
export function disableVerboseCommandQueryBusLogs() {
  console.log(
    `[background/carbon] Disabling verbose logging of incoming CarbonApi requests`
  );
  VERBOSE_CARBON_BUS_LOGS = false;
}
export const debugMiddleware: CommandBusMiddleware<any> =
  (next) => async (ctxPromise) => {
    const ctx = await ctxPromise;
    try {
      if (VERBOSE_CARBON_BUS_LOGS) {
        console.log(
          `[background/carbon] Processing CarbonApi request (type:${ctx.messageType}, name:${ctx.messageName}, id:${ctx.requestId})`
        );
      }
      const result = await next(ctxPromise);
      if (VERBOSE_CARBON_BUS_LOGS) {
        console.log(
          `[background/carbon] Done processing CarbonApi request (type:${ctx.messageType}, name:${ctx.messageName}, id:${ctx.requestId})`
        );
      }
      return result;
    } catch (error) {
      console.error(
        `[background/carbon] Error while processing CarbonApi request (type:${ctx.messageType}, name:${ctx.messageName}, id:${ctx.requestId})`,
        error
      );
      throw error;
    }
  };
