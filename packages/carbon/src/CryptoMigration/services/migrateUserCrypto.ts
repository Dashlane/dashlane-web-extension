import {
  CryptoAlgorithm,
  CryptoMigrationStatus,
  CryptoMigrationType,
  Trigger,
  UserMigrateCryptoEvent,
} from "@dashlane/hermes";
import {
  CryptoMigrationApiErrorType,
  MigrateUserCryptoResult,
} from "@dashlane/communication";
import {
  ARGON2_DEFAULT_PAYLOAD,
  CryptoPayload,
  KWC3_DEFAULT_PAYLOAD,
  PBKDF2_DEFAULT_PAYLOAD,
} from "Libs/CryptoCenter/transportable-data";
import { CoreServices } from "Services";
import { sendExceptionLog } from "Logs/Exception";
import { waitUntilSyncComplete } from "User/Services/wait-until-sync-complete";
import { decryptAllUserData } from "./helpers/decryptAllUserData";
import { getDataToMigrate } from "./helpers/getDataToMigrate";
import { reEncryptAllUserData } from "./helpers/reEncryptAllUserData";
import { resetMasterPasswordEncryptorService } from "./helpers/resetMasterPasswordEncryptorService";
import { updateAndPersistLocalData } from "./helpers/updateAndPersistLocalData";
import { uploadDataOnServer } from "./helpers/uploadDataOnServerParams";
const logEventMapper: Record<CryptoPayload, CryptoAlgorithm> = {
  [KWC3_DEFAULT_PAYLOAD]: CryptoAlgorithm.Kwc3,
  [ARGON2_DEFAULT_PAYLOAD]: CryptoAlgorithm.Argon2d,
  [PBKDF2_DEFAULT_PAYLOAD]: CryptoAlgorithm.Pbkdf2,
};
export async function migrateUserCrypto(
  services: CoreServices,
  previousCryptoPayload: CryptoPayload,
  newCryptoPayload: CryptoPayload,
  migrationType: CryptoMigrationType
): Promise<MigrateUserCryptoResult> {
  try {
    const {
      sessionService,
      storeService,
      masterPasswordEncryptorService,
      localStorageService,
      eventLoggerService,
    } = services;
    const syncCompleted = await waitUntilSyncComplete(storeService);
    if (!syncCompleted) {
      return {
        success: false,
        error: {
          code: CryptoMigrationApiErrorType.ChangeUserCryptoFailed,
        },
      };
    }
    const logCryptoMigration = (status: CryptoMigrationStatus) =>
      eventLoggerService.logEvent(
        new UserMigrateCryptoEvent({
          newCrypto: logEventMapper[newCryptoPayload],
          previousCrypto: logEventMapper[previousCryptoPayload],
          type: migrationType,
          status,
        })
      );
    const { transactions, sharingKeys, timestamp } = await getDataToMigrate(
      storeService,
      logCryptoMigration
    );
    const { clearTransactions, clearPrivateKey } = await decryptAllUserData(
      sessionService,
      storeService,
      masterPasswordEncryptorService,
      { transactions, sharingKeys }
    );
    resetMasterPasswordEncryptorService(services, newCryptoPayload);
    const { encryptedTransactions, encryptedPrivateKey } =
      await reEncryptAllUserData(
        masterPasswordEncryptorService,
        {
          clearTransactions,
          clearPrivateKey,
        },
        logCryptoMigration
      );
    await uploadDataOnServer(
      storeService,
      {
        timestamp,
        transactions: encryptedTransactions,
        sharingKeys: {
          publicKey: sharingKeys.publicKey,
          privateKey: encryptedPrivateKey,
        },
      },
      logCryptoMigration
    );
    await updateAndPersistLocalData(
      storeService,
      sessionService,
      localStorageService,
      newCryptoPayload,
      logCryptoMigration
    );
    await sessionService.getInstance().user.attemptSync(Trigger.SettingsChange);
    logCryptoMigration(CryptoMigrationStatus.Success);
    return { success: true };
  } catch (error) {
    resetMasterPasswordEncryptorService(services, previousCryptoPayload);
    sendExceptionLog({
      funcName: `migrateUserCrypto`,
      fileName: `/carbon/src/CryptoMigration/services/migrate-user-crypto.ts`,
      message: `Migration from KWC3 to Argon2 failed with error: ${error}`,
    });
    return {
      success: false,
      error: {
        code: CryptoMigrationApiErrorType.ChangeUserCryptoFailed,
        message: error.message,
      },
    };
  }
}
