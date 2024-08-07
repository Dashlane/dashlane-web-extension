import { merge } from "rxjs";
import { filter, map } from "rxjs/operators";
import { BufferedEventStream, Listener } from "@dashlane/framework-infra";
import {
  UncaughtErrorEvent,
  UncaughtErrorSource,
} from "@dashlane/framework-application";
import { makeFileLocation } from "./make";
function mapErrorEventToUncaughtErrorEvent(
  event: ErrorEvent
): UncaughtErrorEvent {
  const fileLocation = makeFileLocation({
    column: event.colno,
    line: event.lineno,
    name: event.filename,
  });
  return {
    error: event.error,
    fileLocation,
    origin: "uncaughtException" as const,
  };
}
function mapPromiseRejectionEventToUncaughtErrorEvent(
  event: PromiseRejectionEvent
): UncaughtErrorEvent {
  return {
    error: event.reason,
    origin: "unhandledPromiseRejection" as const,
  };
}
function isPromiseRejectionNotSilenced(event: PromiseRejectionEvent) {
  if (event.reason instanceof TypeError) {
    if (
      event.reason.message === "Failed to fetch" &&
      event.reason.stack?.includes("assets/argon2/argon2.min.js")
    ) {
      return false;
    }
  }
  return true;
}
function preventDefaultHandling<TEvent extends Event>(event: TEvent) {
  event.preventDefault();
}
function initUncaughtExceptions$(context: Window) {
  let lowLevelListener: (event: ErrorEvent) => void;
  return new BufferedEventStream<ErrorEvent, Window>(
    {
      addListener: (listener: Listener<Window>) => {
        lowLevelListener = (event: ErrorEvent) => {
          preventDefaultHandling(event);
          return listener(event, context);
        };
        context.addEventListener("error", lowLevelListener);
      },
      removeListener: () => {
        context.removeEventListener("error", lowLevelListener);
      },
    },
    (err: unknown): err is ErrorEvent => true
  ).events$.pipe(
    map(([event]) => event),
    map(mapErrorEventToUncaughtErrorEvent)
  );
}
function initUnhandledPromiseRejections$(context: Window) {
  let lowLevelListener: (event: PromiseRejectionEvent) => void;
  return new BufferedEventStream<PromiseRejectionEvent>(
    {
      addListener: (listener: Listener<Window>) => {
        lowLevelListener = (event: PromiseRejectionEvent) => {
          preventDefaultHandling(event);
          return listener(event, context);
        };
        context.addEventListener("unhandledrejection", lowLevelListener);
      },
      removeListener: () => {
        context.removeEventListener("unhandledrejection", lowLevelListener);
      },
    },
    (event: unknown): event is PromiseRejectionEvent => true
  ).events$.pipe(
    map(([event]) => event),
    filter(isPromiseRejectionNotSilenced),
    map(mapPromiseRejectionEventToUncaughtErrorEvent)
  );
}
export class ExtensionUncaughtErrorSource extends UncaughtErrorSource {
  public constructor(context: Window) {
    const events$ = merge(
      initUncaughtExceptions$(context),
      initUnhandledPromiseRejections$(context)
    );
    super(events$);
  }
}
