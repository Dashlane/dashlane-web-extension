import { LogExceptionParam, LogExceptionResult } from "@dashlane/communication";
import { CoreServices } from "Services";
import { sendTypedExceptionLog } from "Logs/Exception";
export async function logException(
  _services: CoreServices,
  params: LogExceptionParam
): Promise<LogExceptionResult> {
  await sendTypedExceptionLog(params.exceptionType, params.log);
  return { success: true };
}
