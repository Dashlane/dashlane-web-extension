import {
  ChangeMasterPasswordCode,
  ChangeMasterPasswordError,
  ChangeMasterPasswordStepNeeded,
  ChangeMPFlowPath,
} from "@dashlane/communication";
import { emitChangeMasterPasswordStatus } from "ChangeMasterPassword/Api/live";
import { sendExceptionLog } from "Logs/Exception";
export const makeReturnErrorObject = (
  code: ChangeMasterPasswordCode,
  flow: ChangeMPFlowPath
): ChangeMasterPasswordError => {
  emitChangeMasterPasswordStatus({
    type: ChangeMasterPasswordStepNeeded.ERROR,
    value: 100,
  });
  const message = `[ChangeMP] ${flow}: ${code}`;
  const augmentedError = new Error(message);
  sendExceptionLog({ error: augmentedError });
  return {
    success: false,
    error: {
      code,
    },
  };
};
