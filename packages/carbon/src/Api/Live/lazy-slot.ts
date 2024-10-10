import { Slot } from "ts-event-bus";
import { Observable, Subscription } from "rxjs";
import { logInfo, logWarn } from "Logs/Debugger/console";
const logTags = ["API", "Live"];
const debuggable = <T, U>(
  doDebug: boolean,
  slot: Slot<T>,
  param: string,
  cb: (e: T) => Promise<U>
): ((e: T) => Promise<U>) => {
  if (!doDebug) {
    return cb;
  }
  return (e: T) => {
    logInfo({
      message: `Emitting on ${slot.slotName} with param ${param}`,
      tag: logTags,
      details: {
        event: e,
      },
    });
    return cb(e);
  };
};
export const connectLazySlot = <T>(
  slot: Slot<T>,
  getParametricObservable: (param: string) => Observable<T>,
  doDebug = false
): (() => void) => {
  const subscriptions = new Map<string, Subscription>();
  const onConnect = (param: string) => {
    if (doDebug) {
      logInfo({
        message: `${slot.slotName} subscribed on param ${param}`,
        tag: logTags,
      });
    }
    const observable$ = getParametricObservable(param);
    const baseCb = (e: T) => slot(param, e).catch(() => undefined);
    const debuggableCb = debuggable(doDebug, slot, param, baseCb);
    const subscription = observable$.subscribe(debuggableCb);
    subscriptions.set(param, subscription);
  };
  const onDisconnect = (param: string) => {
    const paramSubscription = subscriptions.get(param);
    if (paramSubscription) {
      if (doDebug) {
        logInfo({
          message: `${slot.slotName} unsubscribed on param ${param}`,
          tag: logTags,
        });
      }
      paramSubscription.unsubscribe();
      subscriptions.delete(param);
    } else if (doDebug) {
      logWarn({
        message: `Cannot unsubscribe from ${slot.slotName} on param ${param}: subscription not found.`,
        tag: logTags,
      });
    }
  };
  return slot.lazy(onConnect, onDisconnect);
};
