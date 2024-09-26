import { CoreServices } from "Services";
import { deviceRemoteDeletion } from "UserManagement";
export async function cleanRemotelyRemovedProfilesHandler({
  storageService,
  storeService,
  moduleClients: { "carbon-legacy": carbon },
}: CoreServices): Promise<void> {
  try {
    await deviceRemoteDeletion(storeService, storageService, carbon);
  } catch (error) {
    throw new Error("Failed to perform device remote deletion");
  }
}
