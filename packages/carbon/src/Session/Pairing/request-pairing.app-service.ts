import { StoreService } from "Store";
import { pairingIdSelector } from "Session/Pairing/pairing.selectors";
import { getSyncAppSetting } from "Application/ApplicationSettings";
import { pairingSucceeded } from "Session/Store/session/actions";
import { makeDashlaneApiPairingService } from "Session/Pairing/pairing-service.dashlane-api-adapter";
export const requestPairing = async (
  storeService: StoreService,
  login: string
): Promise<void> => {
  const state = storeService.getState();
  const currentPairingId = pairingIdSelector(state);
  if (currentPairingId) {
    return;
  }
  const syncWithLocalClients = getSyncAppSetting("syncWithLocalClients");
  if (!syncWithLocalClients) {
    return;
  }
  const pairingService = makeDashlaneApiPairingService(storeService);
  const pairingResult = await pairingService.requestPairing(login);
  const pairingId = pairingResult?.pairingId;
  if (pairingId) {
    storeService.dispatch(pairingSucceeded(pairingId));
  }
};
