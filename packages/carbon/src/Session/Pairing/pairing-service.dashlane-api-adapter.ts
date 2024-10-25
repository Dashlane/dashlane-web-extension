import { StoreService } from "Store";
import * as DashlaneApi from "Libs/DashlaneApi";
import {
  PairingService,
  RequestPairingResult,
} from "Session/Pairing/pairing-service.port";
import { logError } from "Logs/Debugger";
const requestPairing = async (
  storeService: StoreService,
  login: string
): Promise<RequestPairingResult> => {
  try {
    const result = await DashlaneApi.requestPairing(storeService, login);
    if (DashlaneApi.isApiError(result)) {
      throw result;
    }
    return result.pairingId
      ? {
          pairingId: result.pairingId,
        }
      : undefined;
  } catch (error) {
    logError({ message: `Pairing request failed: ${error}` });
    return undefined;
  }
};
export const makeDashlaneApiPairingService = (
  storeService: StoreService
): PairingService => {
  return {
    requestPairing: (login: string) => requestPairing(storeService, login),
  };
};
