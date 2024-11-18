import { AppInitialized, EventBusService } from "EventBus";
import { sendLocalAccounts } from "Session/SessionCommunication";
import { CoreServices } from "Services/";
import { deviceRemoteDeletion } from "UserManagement";
import { getLocalAccounts } from "Authentication";
import { localAccountsListUpdated } from "Authentication/Store/localAccounts/actions";
import { restoreLastAuthenticatedUser } from "Libs/RememberMe/restore-last-authenticated-user";
import { InitMode } from "Sdk/Default/types";
import { localAccountsInitializedSelector } from "Authentication/selectors";
export function setupSubscriptions(
  eventBus: EventBusService,
  services: CoreServices
) {
  const {
    storageService,
    storeService,
    moduleClients: { "carbon-legacy": carbonClient },
  } = services;
  eventBus.appInitialized.on(async (event: AppInitialized) => {
    const localAccountInitialized = localAccountsInitializedSelector(
      storeService.getState()
    );
    if (event.initMode === InitMode.FirstInit) {
      await deviceRemoteDeletion(storeService, storageService, carbonClient);
      const localAccounts = await getLocalAccounts(
        storeService,
        storageService
      );
      await restoreLastAuthenticatedUser(services, localAccounts);
      sendLocalAccounts(localAccounts);
      services.storeService.dispatch(localAccountsListUpdated(localAccounts));
    } else if (!localAccountInitialized) {
      const localAccounts = await getLocalAccounts(
        storeService,
        storageService
      );
      sendLocalAccounts(localAccounts);
      services.storeService.dispatch(localAccountsListUpdated(localAccounts));
    }
  });
}
