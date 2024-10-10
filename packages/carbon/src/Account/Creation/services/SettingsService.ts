import * as communication from "@dashlane/communication";
import type { Transaction } from "Libs/Backup/Transactions/types";
import * as BackupCrypt from "Libs/Backup/BackupCrypt";
import { getTransactionXml } from "Libs/Backup/Transactions";
import { ARGON2_DEFAULT_PAYLOAD } from "Libs/CryptoCenter";
import { CRYPTO_NODERIVATION_HMAC64 } from "Libs/CryptoCenter/constant";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { bufferToBase64 } from "Libs/CryptoCenter/Helpers/Helper";
import { getRandomValues } from "Libs/CryptoCenter/Helpers/WebCryptoWrapper";
import { SettingsState } from "Session/Store/account-creation/actions";
import { isSSOAccountCreationSelector } from "Session/Store/account-creation/selectors";
import { makeBasePersonalSettings } from "Session/Store/personalSettings";
import { StoreService } from "Store";
import { generateItemUuid } from "Utils/generateItemUuid";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { EncryptOptions } from "Libs/CryptoCenter/types";
export function encryptSettings(
  storeService: StoreService,
  dataEncryptorService: DataEncryptorService,
  params: communication.CreateAccountRequest
): SettingsState {
  const usagelogToken = generateItemUuid();
  const accountCreationDatetime = getUnixTimestamp();
  const randomSaltBuffer = getRandomValues(16);
  const state = storeService.getState();
  const isSSOAccountCreation = isSSOAccountCreationSelector(state);
  const cryptoUserPayload = isSSOAccountCreation
    ? CRYPTO_NODERIVATION_HMAC64
    : ARGON2_DEFAULT_PAYLOAD;
  const personalSettings: communication.PersonalSettings = {
    ...makeBasePersonalSettings(),
    AnonymousUserId: params.anonymousUserId,
    UsagelogToken: usagelogToken,
    Format: params.format,
    Language: params.language,
    SecurityEmail: params.login,
    RealLogin: params.login,
    accountCreationDatetime,
    SyncBackup: true,
    CryptoFixedSalt: bufferToBase64(randomSaltBuffer),
    CryptoUserPayload: cryptoUserPayload,
  };
  const xml = getTransactionXml(personalSettings);
  const clearTransaction: Transaction = {
    time: getUnixTimestamp(),
    backupDate: 0,
    type: "SETTINGS",
    action: "BACKUP_EDIT",
    identifier: "SETTINGS_userId",
    content: xml,
  };
  const encryptOptions: EncryptOptions = {
    forceSalt: randomSaltBuffer,
  };
  return {
    personalSettings,
    promise: BackupCrypt.encryptSingleTransaction(
      dataEncryptorService,
      clearTransaction,
      encryptOptions
    ),
  };
}
