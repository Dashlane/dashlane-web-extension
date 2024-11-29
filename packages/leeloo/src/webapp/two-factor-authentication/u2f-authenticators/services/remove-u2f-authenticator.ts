import { carbonConnector } from "../../../../libs/carbon/connector";
export const removeU2FAuthenticator = async (
  authenticationCode: string,
  keyHandle: string
) => {
  const result = await carbonConnector.removeU2FAuthenticator({
    authenticationCode,
    keyHandle,
  });
  return result;
};
