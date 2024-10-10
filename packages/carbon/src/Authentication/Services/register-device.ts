import { RegisterDeviceData } from "@dashlane/communication";
import { registerDevice } from "Session/RemoteAuthentication";
import { CoreServices } from "Services";
import { wipeOutLocalAccounts } from "UserManagement";
export async function registerDeviceHandler(
  { storeService, storageService, moduleClients, sessionService }: CoreServices,
  deviceData: RegisterDeviceData
): Promise<void> {
  await sessionService.close(false);
  await wipeOutLocalAccounts(storageService, moduleClients["carbon-legacy"], [
    deviceData.login,
  ]);
  await registerDevice(storeService, deviceData);
}
