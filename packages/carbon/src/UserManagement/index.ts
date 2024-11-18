import { deleteUsersPublicSettings } from "Application/ApplicationSettings";
import { StorageService } from "Libs/Storage/types";
import { deleteAllLocalUserData } from "Libs/Storage/User";
import { StoreService } from "Store";
import { getUnauthorizedProfiles, isApiError } from "Libs/DashlaneApi";
import { sendExceptionLog } from "Logs/Exception";
import { getLocalProfiles } from "Session/LocalAuthentication";
import { CarbonLegacyClient } from "@dashlane/communication";
export async function deviceRemoteDeletion(
  storeService: StoreService,
  storageService: StorageService,
  carbonClient: CarbonLegacyClient
): Promise<void> {
  try {
    const accountsToDelete = await getAccountsToDelete(
      storeService,
      storageService
    );
    await wipeOutLocalAccounts(storageService, carbonClient, accountsToDelete);
  } catch (error) {
    const augmentedError = new Error(
      `[UserManagement]: deviceRemoteDeletion - ${error}`
    );
    sendExceptionLog({ error: augmentedError });
  }
}
export async function wipeOutLocalAccounts(
  storageService: StorageService,
  carbonClient: CarbonLegacyClient,
  logins: string[]
) {
  const deletionTasks = logins
    .map((login) => deleteAllLocalUserData(storageService, carbonClient, login))
    .concat(deleteUsersPublicSettings(logins));
  await Promise.all(deletionTasks);
}
async function getAccountsToDelete(
  storeService: StoreService,
  storageService: StorageService
): Promise<string[]> {
  const { profiles, ghostProfiles } = await getLocalProfiles(
    storeService,
    storageService
  );
  const ghostProfilesLogins = ghostProfiles
    .map((profile) => profile.login)
    .filter(Boolean);
  if (profiles.length > 0) {
    const result = await getUnauthorizedProfiles(storeService, {
      profiles,
    });
    if (isApiError(result)) {
      return ghostProfilesLogins;
    }
    return [
      ...ghostProfilesLogins,
      ...result.unauthorizedProfiles.map((profile) => profile.login),
    ];
  }
  return ghostProfilesLogins;
}
