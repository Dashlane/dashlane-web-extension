import { intersection, pluck, reject } from "ramda";
import {
  BaseDataModelObject,
  ExceptionCriticality,
} from "@dashlane/communication";
import type { ClearTransaction } from "Libs/Backup/Transactions/types";
import Debugger from "Logs/Debugger";
import { PersonalData } from "Session/Store/personalData/types";
import { saveObjects } from "Session/Store/personalData";
import { sendExceptionLog } from "Logs/Exception/";
import * as Merge from "Libs/Backup/ResolveConflicts/Merge/";
import {
  isRemovalUploadChange,
  UploadChange,
} from "Libs/Backup/Upload/UploadChange/";
import { isRemovalTransaction } from "Libs/Backup/Transactions/";
import { getTransactionTypeFromDataModelType } from "Libs/Backup/Transactions/types";
import { generateLocalDuplicates } from "Libs/Backup/ResolveConflicts/Duplicate";
import { announcements, AnnounceSync } from "Libs/Backup/Probe";
import { createUploadChangeForItem } from "Libs/Backup/Upload/UploadChange/upload-change.factories";
interface ConflictingChangesResult {
  changesToUpload: UploadChange[];
  transactionsToDownload: ClearTransaction[];
  editConflicts: string[];
}
function getConflictingChanges(
  changesToUpload: UploadChange[],
  remoteTransactions: ClearTransaction[],
  sharedItemIds: Set<string>
): ConflictingChangesResult {
  if (remoteTransactions.length === 0) {
    return {
      changesToUpload,
      transactionsToDownload: remoteTransactions,
      editConflicts: [],
    };
  }
  const itemsInConflict = intersection(
    pluck("identifier", remoteTransactions),
    pluck("itemId", changesToUpload)
  );
  const changesToUploadInConflict = changesToUpload.filter((c) =>
    itemsInConflict.includes(c.itemId)
  );
  if (changesToUploadInConflict.length === 0) {
    return {
      changesToUpload,
      transactionsToDownload: remoteTransactions,
      editConflicts: [],
    };
  }
  const usableUploadChanges = reject<UploadChange>((change) => {
    return (
      isRemovalUploadChange(change) && itemsInConflict.includes(change.itemId)
    );
  }, changesToUpload);
  const usableRemoteChanges = reject((transaction) => {
    return (
      (isRemovalTransaction(transaction) ||
        sharedItemIds.has(transaction.identifier)) &&
      itemsInConflict.includes(transaction.identifier)
    );
  }, remoteTransactions);
  const editConflicts = intersection(
    pluck("identifier", usableRemoteChanges),
    pluck("itemId", usableUploadChanges)
  );
  return {
    changesToUpload: usableUploadChanges,
    transactionsToDownload: usableRemoteChanges,
    editConflicts,
  };
}
interface DuplicateChangesResult {
  uploadChangesWithDuplicates: UploadChange[];
  usableRemoteTransactions: ClearTransaction[];
  duplicateObjects: BaseDataModelObject[];
}
function handleDuplicates(
  announce: AnnounceSync,
  personalData: PersonalData,
  changesToUpload: UploadChange[],
  remoteTransactions: ClearTransaction[],
  editConflicts: string[]
): DuplicateChangesResult {
  if (editConflicts.length === 0) {
    return {
      uploadChangesWithDuplicates: changesToUpload,
      usableRemoteTransactions: remoteTransactions,
      duplicateObjects: [],
    };
  }
  const duplicates = generateLocalDuplicates(
    editConflicts,
    personalData,
    remoteTransactions
  );
  const duplicateObjects = duplicates.map((duplicate) => duplicate.duplicate);
  const duplicateTransactions: ClearTransaction[] = duplicateObjects.map(
    (object) => {
      const transaction: ClearTransaction = {
        action: "BACKUP_EDIT",
        backupDate: 0,
        identifier: object.Id,
        objectType: "transaction",
        time: Date.now(),
        type: getTransactionTypeFromDataModelType(object.kwType),
        content: object,
      };
      return transaction;
    }
  );
  duplicateTransactions.forEach(({ backupDate, identifier, type }) => {
    announce(announcements.transactionDuplicated(type, identifier, backupDate));
  });
  const duplicatedIds = duplicates.map(
    (duplicate) => duplicate.duplicatedFromId
  );
  const uploadChangesWithDuplicates = changesToUpload
    .filter((change) => !duplicatedIds.includes(change.itemId))
    .concat(duplicateObjects.map(createUploadChangeForItem));
  const usableRemoteTransactions = remoteTransactions
    .filter((transaction) => {
      return (
        !editConflicts.includes(transaction.identifier) ||
        duplicatedIds.includes(transaction.identifier)
      );
    })
    .concat(duplicateTransactions);
  return {
    uploadChangesWithDuplicates,
    duplicateObjects,
    usableRemoteTransactions: usableRemoteTransactions,
  };
}
export interface ResolveConflictResult {
  personalData: PersonalData;
  remoteTransactions: ClearTransaction[];
}
export default function resolveConflicts(
  announce: AnnounceSync,
  localPersonalData: PersonalData,
  sharedItemIds: Set<string>,
  remoteTransactions: ClearTransaction[]
): ResolveConflictResult {
  const { changesToUpload, editConflicts, transactionsToDownload } =
    getConflictingChanges(
      localPersonalData.changesToUpload,
      remoteTransactions,
      sharedItemIds
    );
  if (editConflicts.length === 0) {
    return {
      personalData: {
        ...localPersonalData,
        changesToUpload,
      },
      remoteTransactions: [...transactionsToDownload],
    };
  }
  const conflictErrMsg = `[Sync] conflict on local/remote changes, ${editConflicts.length} conflicts`;
  Debugger.log(conflictErrMsg);
  sendExceptionLog({
    error: new Error(conflictErrMsg),
    code: ExceptionCriticality.WARNING,
  });
  const {
    duplicateObjects,
    uploadChangesWithDuplicates,
    usableRemoteTransactions,
  } = handleDuplicates(
    announce,
    localPersonalData,
    changesToUpload,
    transactionsToDownload,
    editConflicts
  );
  const updatedPersonalData = saveObjects(localPersonalData, duplicateObjects);
  const remoteTransactionsToMerge = Merge.getMergeableTransactions(
    usableRemoteTransactions,
    uploadChangesWithDuplicates
  );
  if (remoteTransactionsToMerge.length === 0) {
    return {
      personalData: {
        ...updatedPersonalData,
        changesToUpload: uploadChangesWithDuplicates,
      },
      remoteTransactions: [...usableRemoteTransactions],
    };
  }
  const mergeResult = Merge.mergeLocalAndRemote(
    updatedPersonalData,
    remoteTransactionsToMerge
  );
  return {
    personalData: {
      ...mergeResult.personalData,
      changesToUpload: uploadChangesWithDuplicates,
    },
    remoteTransactions: [
      ...usableRemoteTransactions,
      ...mergeResult.remoteTransactions,
    ],
  };
}
