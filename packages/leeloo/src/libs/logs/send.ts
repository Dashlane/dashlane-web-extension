import { debounce, throttle } from "lodash";
import State from "./types";
import * as actions from "./actions";
import { sendWebsiteLogs } from "./website/send";
export interface ExtraParams {
  desktopAnonymousComputerId: string;
  device: string;
  websiteTrackingId: string;
  anonymousUserId: string;
  sessionId: number;
  userAgent: string;
}
const logActions = {
  website: {
    send: sendWebsiteLogs,
    fail: actions.sendWebsiteFailure,
  },
};
const send = function (
  dispatch: Function,
  anonymousUserId: string,
  sessionId: number,
  logs: State
): void {
  dispatch(actions.sendInitiated());
  const extra: ExtraParams = {
    desktopAnonymousComputerId: logs.desktopAnonymousComputerId,
    device: logs.device.toUpperCase(),
    websiteTrackingId: logs.websiteTrackingId,
    anonymousUserId: anonymousUserId,
    sessionId: sessionId,
    userAgent: logs.userAgent,
  };
  Object.keys(logActions)
    .filter((key: string) => logs[key].length)
    .forEach((key) => {
      logActions[key].send(logs[key], extra).catch(() => {});
    });
};
const DEBOUNCE_DELAY_MS = 100;
const THROTTLE_INTERVAL_MS = 3000;
const throttledSend = debounce(
  throttle(send, THROTTLE_INTERVAL_MS),
  DEBOUNCE_DELAY_MS
);
const logLength = (logs: State) => {
  return Object.keys(logActions)
    .map((key: string) => logs[key] && logs[key].length)
    .reduce((a, b) => a + b);
};
export default function (
  dispatch: Function,
  anonymousUserId: string,
  sessionId: number,
  logs: State
): void {
  if (logLength(logs)) {
    throttledSend(dispatch, anonymousUserId, sessionId, logs);
  }
}
export const sendImmediately = (
  dispatch: Function,
  anonymousUserId: string,
  sessionId: number,
  logs: State
): void => {
  if (logLength(logs)) {
    send(dispatch, anonymousUserId, sessionId, logs);
  }
};
