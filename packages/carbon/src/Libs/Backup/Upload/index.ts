import {
  compose,
  contains,
  defaultTo,
  filter,
  find,
  flip,
  identity,
  propEq,
  propOr,
  propSatisfies,
  uniq,
} from "ramda";
import {
  BaseDataModelObject,
  DataModelObject,
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY,
  DataModelType,
  PersonalSettings,
} from "@dashlane/communication";
import type { Transaction } from "Libs/Backup/Transactions/types";
import { PersonalData } from "Session/Store/personalData/types";
import {
  isRemovalUploadChange,
  UploadChange,
  UploadChangeAction,
} from "Libs/Backup/Upload/UploadChange";
import {
  createNewTransaction,
  supportedForUploadKwTypeToTransactionTypeMap,
} from "Libs/Backup/Transactions";
import {
  countEditionTransactions,
  countRemoveTransactions,
} from "Libs/Backup/Transactions/utils";
import { WSService } from "Libs/WS/index";
import { SyncSummary } from "Libs/WS/Backup/types";
import { CryptoCenterService } from "Libs/CryptoCenter/types";
import { announcements, AnnounceSync } from "Libs/Backup/Probe";
const SUPPORTED_CONTENT_TYPES = Object.keys(
  supportedForUploadKwTypeToTransactionTypeMap
);
export interface ContentToUpload {
  action: UploadChangeAction;
  itemId: string;
  kwType: DataModelType;
  content: BaseDataModelObject;
}
const isSupportedTypeForUpload = flip(contains)(SUPPORTED_CONTENT_TYPES);
const getSupportedChangesToUpload = compose<
  UploadChange[],
  UploadChange[],
  UploadChange[],
  UploadChange[],
  UploadChange[]
>(
  uniq,
  filter(propSatisfies(isSupportedTypeForUpload, "kwType")),
  filter(propSatisfies(Boolean, "itemId")),
  defaultTo([])
);
export function gatherContentsToUpload(
  personalData: PersonalData,
  personalSettings: PersonalSettings
): ContentToUpload[] {
  const supportedChangesToUpload = getSupportedChangesToUpload(
    personalData.changesToUpload
  );
  return supportedChangesToUpload
    .map((change) => {
      const { action, kwType, itemId } = change;
      const keyInStore = DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[kwType];
      if (isRemovalUploadChange(change)) {
        return {
          action,
          kwType,
          itemId,
          content: null,
        };
      } else if (
        change.kwType === "KWSettingsManagerApp" &&
        itemId === "SETTINGS_userId"
      ) {
        return {
          action,
          kwType,
          itemId,
          content: personalSettings,
        };
      }
      const content = find<DataModelObject>(
        propEq("Id", itemId),
        personalData[keyInStore]
      );
      if (content) {
        return {
          action,
          kwType,
          itemId,
          content,
        };
      }
      return null;
    })
    .filter(identity);
}
export interface UploadParams {
  login: string;
  uki: string;
  lock: string;
  ws: WSService;
  personalData: PersonalData;
  personalSettings: PersonalSettings;
  cryptoCenterService: CryptoCenterService;
  publicKey?: string;
  privateKey?: string;
  announce: AnnounceSync;
}
export interface UploadResult {
  uploadedTransactionsId: string[];
  lastSyncTimestamp?: number;
  summary?: SyncSummary;
}
const prepareTransactions = async (
  cryptoCenterService: CryptoCenterService,
  announce: AnnounceSync,
  contentsToUpload: ContentToUpload[]
): Promise<Transaction[]> => {
  announce(announcements.cipherStarted());
  const transactionCreationTasks = contentsToUpload.map((content) =>
    createNewTransaction(cryptoCenterService, announce, content)
  );
  const transactionsToUpload = await Promise.all(transactionCreationTasks);
  announce(announcements.cipherFinished());
  return transactionsToUpload.filter(Boolean);
};
export async function upload(args: UploadParams): Promise<UploadResult> {
  const { announce, cryptoCenterService, personalData, personalSettings } =
    args;
  const contentsToUpload = gatherContentsToUpload(
    personalData,
    personalSettings
  );
  const transactionsToUpload = await prepareTransactions(
    cryptoCenterService,
    announce,
    contentsToUpload
  );
  if (transactionsToUpload.length === 0) {
    return {
      uploadedTransactionsId: [],
    };
  }
  try {
    const updatedTransactionsCount =
      countEditionTransactions(transactionsToUpload);
    const deletedTransactionsCount =
      countRemoveTransactions(transactionsToUpload);
    announce(
      announcements.uploadRequested(
        updatedTransactionsCount,
        deletedTransactionsCount
      )
    );
    const result = await args.ws.backup.upload({
      login: args.login,
      uki: args.uki,
      lock: args.lock,
      transactions: transactionsToUpload,
      privateKey: args.privateKey,
      publicKey: args.publicKey,
    });
    const uploadedTransactionsId = transactionsToUpload.reduce(
      (acc, current) => {
        if (current.identifier) {
          acc.push(current.identifier);
        }
        return acc;
      },
      []
    );
    announce(
      announcements.uploadSucceeded(
        updatedTransactionsCount,
        deletedTransactionsCount,
        result.timestamp
      )
    );
    return {
      uploadedTransactionsId,
      lastSyncTimestamp: Number(result.timestamp),
      summary: result.summary,
    };
  } catch (error) {
    announce(announcements.uploadFailed(error));
    throw error;
  }
}
export function isUploadNeeded(personalData: PersonalData): boolean {
  const changesToUploadList: UploadChange[] = propOr(
    [],
    "changesToUpload",
    personalData
  );
  if (changesToUploadList.length === 0) {
    return false;
  }
  const supportedChangesToUpload =
    getSupportedChangesToUpload(changesToUploadList);
  return supportedChangesToUpload.length > 0;
}
