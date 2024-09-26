import { changeMPDone } from "Session/Store/changeMasterPassword/actions";
import { wipeOutLocalAccounts } from "UserManagement";
import { userLoginSelector } from "Session/selectors";
import { CoreServices } from "Services";
export const logoutUserOnError = ({
  storeService,
  storageService,
  sessionService,
  moduleClients,
}: CoreServices) => {
  const login = userLoginSelector(storeService.getState());
  storeService.dispatch(changeMPDone());
  if (login) {
    void wipeOutLocalAccounts(storageService, moduleClients["carbon-legacy"], [
      login,
    ]);
  }
  sessionService.close();
};
