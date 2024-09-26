import {
  ChangeMasterPasswordCode,
  ChangeMasterPasswordUnexpectedError,
  ChangeMPFlowPath,
} from "@dashlane/communication";
import { sendExceptionLog } from "Logs/Exception";
export const makeUnexpectedErrorObject = (
  message: string,
  flow: ChangeMPFlowPath
): ChangeMasterPasswordUnexpectedError => {
  const errorMsg = `[ChangeMP] - Unexpected - ${flow}: ${message}`;
  const error = new Error(errorMsg);
  sendExceptionLog({ error });
  return {
    success: false,
    error: {
      code: ChangeMasterPasswordCode.UNKNOWN_ERROR,
      message,
    },
  };
};
