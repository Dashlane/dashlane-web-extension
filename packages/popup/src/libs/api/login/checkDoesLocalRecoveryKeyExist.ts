import { carbonConnector } from "../../../carbonConnector";
export const checkDoesLocalRecoveryKeyExist = async () => {
  return await carbonConnector.checkDoesLocalRecoveryKeyExist();
};
