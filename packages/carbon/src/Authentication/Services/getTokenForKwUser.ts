import { CoreServices } from "Services";
import { getTokens, isApiError } from "Libs/DashlaneApi";
export const getTokenForKwUser = async (
  services: CoreServices,
  email: string
): Promise<string> => {
  const { storeService } = services;
  const response = await getTokens(storeService);
  if (isApiError(response)) {
    throw new Error(`Error: ${response.code}`);
  }
  const { tokens } = response;
  const loginTokenPair = tokens.find((pair) => pair.login === email);
  if (!loginTokenPair) {
    throw new Error("Email token not found for " + email);
  }
  return loginTokenPair.token;
};
