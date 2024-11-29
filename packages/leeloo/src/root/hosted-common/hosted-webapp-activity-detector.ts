import { UserActivityMessage } from "./common/user-activity-message";
const ACTIVITY_GENERATING_EVENTS: (keyof GlobalEventHandlersEventMap)[] = [
  "mousedown",
  "keydown",
];
const DEBOUNCE_TIME_MS = 1000;
export function startWebappActivityMonitor(worker: Worker) {
  let willSendNextAt = Date.now();
  function notifyWorkerOfUserActivity() {
    const now = Date.now();
    if (willSendNextAt > now) {
      return;
    }
    worker.postMessage(UserActivityMessage);
    willSendNextAt = now + DEBOUNCE_TIME_MS;
  }
  for (const event of ACTIVITY_GENERATING_EVENTS) {
    document.addEventListener(event, notifyWorkerOfUserActivity);
  }
}
