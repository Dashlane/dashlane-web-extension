import { ExceptionLog, ExceptionType } from "@dashlane/communication";
import { InternalExceptionLog } from "Logs/Exception/types";
import send from "Logs/Exception/send";
import makeLog from "Logs/Exception/make-log";
import { Debugger } from "Logs/Debugger";
export { bootstrap } from "Logs/Exception/bootstrap";
let allowedToSendExceptionLog = true;
export const setAllowedToSendExceptionLog = (isAllowed: boolean) =>
  (allowedToSendExceptionLog = isAllowed);
export async function sendExceptionLog(
  log: ExceptionLog | InternalExceptionLog
): Promise<void> {
  if (!allowedToSendExceptionLog) {
    console.log(`[background/carbon] Not allowed to send exception logs`);
    return;
  }
  try {
    const fullLog = makeLog("carbonException", log);
    console.log(`[background/carbon] Sending exception`, fullLog);
    await send(fullLog);
  } catch (error) {
    console.log(`[background/carbon] Failed sending exception`, error);
  }
}
export async function sendTypedExceptionLog(
  exceptionType: ExceptionType,
  log: ExceptionLog | InternalExceptionLog
): Promise<void> {
  if (!allowedToSendExceptionLog) {
    return;
  }
  try {
    await send(makeLog(exceptionType, log));
  } catch (error) {
    Debugger.error(
      `[Exception] - sendTypedExceptionLog: ${error.message || error}`
    );
  }
}
