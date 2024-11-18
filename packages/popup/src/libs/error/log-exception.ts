import { ExceptionLog } from "@dashlane/communication";
import { carbonConnector } from "../../carbonConnector";
export const logException = (exception: ExceptionLog) =>
  carbonConnector.logException({
    exceptionType: "popupException",
    log: exception,
  });
