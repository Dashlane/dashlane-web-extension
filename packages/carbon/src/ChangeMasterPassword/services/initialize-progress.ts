import { ChangeMasterPasswordStepNeeded } from "@dashlane/communication";
import { emitChangeMasterPasswordStatus } from "ChangeMasterPassword/Api/live";
export const initializeProgress = (
  typeOfOperation: ChangeMasterPasswordStepNeeded,
  batchSize: number,
  nbrTotalTransaction: number
): Function => {
  const step = 40;
  const baseValue =
    typeOfOperation === ChangeMasterPasswordStepNeeded.DECRYPTING ? 10 : 50;
  let completed = 0;
  return () => {
    completed++;
    if (completed % batchSize === 0 || completed === nbrTotalTransaction) {
      emitChangeMasterPasswordStatus({
        type: typeOfOperation,
        value: baseValue + Math.round((step * completed) / nbrTotalTransaction),
      });
    }
  };
};
