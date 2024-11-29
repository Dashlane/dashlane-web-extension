import { GlobalIntentHandler } from "redux-cursor";
import State, { WebsiteLogEntry } from "./types";
import reducer from "./reducer";
const addLogToState = (
  global: GlobalIntentHandler,
  kind: string,
  details: {}
) => {
  global("logs", { kind, details });
};
export const flushLogsRequestedAction = reducer.registerAction<void>(
  "FLUSH_LOGS_REQUESTED",
  (state: State) =>
    Object.assign({}, state, {
      flushLogsRequested: true,
    })
);
export const flushLogsInitiatedAction = reducer.registerAction<void>(
  "FLUSH_LOGS_INITIATED",
  (state: State) =>
    Object.assign({}, state, {
      flushLogsRequested: false,
    })
);
type websiteLogArgs = {
  message: string;
  content: {};
};
interface LogFunc {
  (global: GlobalIntentHandler, params: websiteLogArgs): void;
  warn: (global: GlobalIntentHandler, params: websiteLogArgs) => void;
  error: (global: GlobalIntentHandler, params: websiteLogArgs) => void;
}
const websiteLogFunc = function (
  global: GlobalIntentHandler,
  params: websiteLogArgs
) {
  addLogToState(
    global,
    "website",
    Object.assign({}, params, { level: "info" })
  );
} as LogFunc;
websiteLogFunc.warn = (global: GlobalIntentHandler, params: websiteLogArgs) => {
  addLogToState(
    global,
    "website",
    Object.assign({}, params, { level: "warn" })
  );
};
websiteLogFunc.error = (
  global: GlobalIntentHandler,
  params: websiteLogArgs
) => {
  addLogToState(
    global,
    "website",
    Object.assign({}, params, { level: "error" })
  );
};
export const websiteLog = websiteLogFunc;
export type websiteLogReturn = {
  type: string;
  params: WebsiteLogEntry;
};
interface LogActionFunc {
  (params: websiteLogArgs): websiteLogReturn;
  warn: (params: websiteLogArgs) => websiteLogReturn;
  error: (params: websiteLogArgs) => websiteLogReturn;
}
const websiteLogActionFunc: any = reducer.registerAction<websiteLogArgs>(
  "WEBSITE_LOG",
  (state: State, params: websiteLogArgs) =>
    Object.assign({}, state, {
      website: state.website.concat([{ ...params, level: "info" }]),
    })
);
websiteLogActionFunc.warn = reducer.registerAction(
  "WEBSITE_LOG",
  (state: State, params: websiteLogArgs) =>
    Object.assign({}, state, {
      website: state.website.concat([{ ...params, level: "warn" }]),
    })
);
websiteLogActionFunc.error = reducer.registerAction(
  "WEBSITE_LOG",
  (state: State, params: websiteLogArgs) =>
    Object.assign({}, state, {
      website: state.website.concat([{ ...params, level: "error" }]),
    })
);
export const websiteLogAction = websiteLogActionFunc as LogActionFunc;
