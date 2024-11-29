import { carbonConnector } from "../../../libs/carbon/connector";
export const isMasterPasswordValid = async (masterPassword: string) => {
  const { isMasterPasswordValid: isValid } =
    await carbonConnector.checkIfMasterPasswordIsValid({
      masterPassword,
    });
  if (!isValid) {
    throw new Error("Master password is not valid");
  }
  return isValid;
};
