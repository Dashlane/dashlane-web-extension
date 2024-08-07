import { ExceptionLog } from "@dashlane/communication";
import { SendExceptionLog } from "./error.types";
let send: SendExceptionLog | null = null;
export function sendExceptionLog(log: ExceptionLog): void {
  if (!send) {
    console.error("Send exception log function not set");
    return;
  }
  send(log);
}
export function setExceptionLogSender(fn: SendExceptionLog | null): void {
  send = fn;
}
