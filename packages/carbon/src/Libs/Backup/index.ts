import { dissoc, isNil } from "ramda";
import type { BackupResults, SyncArgs } from "Libs/Backup/types";
import { SyncType } from "Libs/Backup/types";
import { latest, LatestResults } from "Libs/Backup/latest";
import { isUploadNeeded, upload, UploadParams } from "Libs/Backup/Upload";
import resolveConflicts from "Libs/Backup/ResolveConflicts";
import { Debugger } from "Logs/Debugger";
import { changeMPinProgressSelector } from "ChangeMasterPassword/selector";
import { announcements } from "Libs/Backup/Probe";
import { unlock } from "Libs/Backup/unlock";
import { Sharing2Summary, SharingData } from "Session/Store/sharingData/types";
import { getUploadChangesWithoutSettings } from "./Upload/UploadChange";
import {
  clearUploadedChanges,
  scheduleChangesForSync,
  unscheduleRemainingChanges,
} from "Session/Store/personalData/actions";
import { sendExceptionLog } from "Logs/Exception";
import { CarbonError } from "Libs/Error";
const getSharedItemIds = (
  sharing2: Sharing2Summary | undefined,
  sharingData: SharingData
) => {
  const sharedItemIds = new Set<string>();
  const sharingSummaryItems = sharing2 ? sharing2.items || [] : [];
  for (const item of sharingSummaryItems) {
    if (item && typeof item === "object" && item.id) {
      sharedItemIds.add(item.id);
    }
  }
  for (const item of sharingData.items) {
    if (item && typeof item === "object" && item.itemId) {
      sharedItemIds.add(item.itemId);
    }
  }
  return sharedItemIds;
};
export const MIN_SYNC_TIMESTAMP = 999999999999;
export const MAX_SYNC_TIMESTAMP = 2070753783000;
export async function sync(args?: SyncArgs): Promise<BackupResults> {
  const { announce, storeService } = args;
  let latestResult: LatestResults | undefined;
  try {
    const state = storeService.getState();
    verifySyncArgs(args);
    const personalData = args.personalData || storeService.getPersonalData();
    const { isUploadEnabled } = storeService.getSyncStatus();
    Debugger.log(`[Sync] User allowed to Upload: ${isUploadEnabled}`);
    if (isUploadEnabled && isUploadNeeded(personalData)) {
      Debugger.log("[Sync] Found local data to upload");
      args.syncType = SyncType.FULL_SYNC;
      announce(announcements.syncTypeChanged(args.syncType));
    }
    storeService.dispatch(scheduleChangesForSync());
    latestResult = await latest(args);
    const getSyncResultsWithoutUpload = (): BackupResults => ({
      ...dissoc("lock", latestResult),
      syncType: args.syncType,
      isUploadEnabled: latestResult.isUploadEnabled,
      lastSyncTimestamp: getLastSuccessfulSyncTimestamp(
        args.lastSyncTimestamp,
        latestResult.lastSyncTimestamp
      ),
      uploadedTransactions: [],
      summary: latestResult.summary,
    });
    if (changeMPinProgressSelector(state)) {
      await unlock(args, latestResult.lock);
      return getSyncResultsWithoutUpload();
    }
    if (args.syncType !== SyncType.FULL_SYNC || !latestResult.isUploadEnabled) {
      if (latestResult.isUploadEnabled) {
        await unlock(args, latestResult.lock);
      }
      return getSyncResultsWithoutUpload();
    }
    const sharedItemIds = getSharedItemIds(
      latestResult.sharing2,
      storeService.getSharingData()
    );
    const { personalData: newPersonalData, remoteTransactions } =
      resolveConflicts(
        announce,
        personalData,
        sharedItemIds,
        latestResult.clearTransactions
      );
    const sharingKeys = isNil(args.pushKeysToServer)
      ? null
      : {
          publicKey: args.pushKeysToServer.public,
          privateKey: args.pushKeysToServer.private,
        };
    const contentToUpload: UploadParams = {
      login: args.login,
      uki: args.uki,
      lock: latestResult.lock,
      ws: args.ws,
      cryptoCenterService: args.dataEncryptorService.getInstance(),
      personalData: newPersonalData,
      personalSettings: storeService.getPersonalSettings(),
      ...sharingKeys,
      announce,
    };
    const uploadResult = await upload(contentToUpload);
    if (uploadResult.uploadedTransactionsId.length === 0) {
      unlock(args, latestResult.lock);
    }
    storeService.dispatch(
      clearUploadedChanges(uploadResult.uploadedTransactionsId)
    );
    return {
      ...dissoc("lock", latestResult),
      clearTransactions: remoteTransactions,
      syncType: args.syncType,
      isUploadEnabled: latestResult.isUploadEnabled,
      uploadedTransactions: uploadResult.uploadedTransactionsId,
      lastSyncTimestamp: getLastSuccessfulSyncTimestamp(
        args.lastSyncTimestamp,
        uploadResult.lastSyncTimestamp
      ),
      summary: uploadResult.summary || latestResult.summary,
    };
  } catch (error) {
    if (latestResult) {
      await unlock(args, latestResult.lock);
    }
    if (error && error.message === "TOKEN_ACCOUNT_LOCKED") {
    }
    throw error;
  } finally {
    storeService.dispatch(unscheduleRemainingChanges());
  }
}
export function getLastSuccessfulSyncTimestamp(
  localTimestamp: number,
  serverTimestamp: any
): number {
  const parsedServerTimestamp = Number(serverTimestamp);
  return serverTimestamp === "" ||
    isNil(serverTimestamp) ||
    isNaN(parsedServerTimestamp)
    ? localTimestamp
    : parsedServerTimestamp;
}
function verifySyncArgs(syncArgs: SyncArgs) {
  switch (syncArgs.syncType) {
    case SyncType.FIRST_SYNC: {
      if (syncArgs.lastSyncTimestamp !== 0) {
        throw new Error(
          "Sync Error: lastSyncTimestamp should be 0 on First Sync"
        );
      }
      const changesToUpload = getUploadChangesWithoutSettings(
        syncArgs.personalData?.changesToUpload ?? []
      );
      if (changesToUpload?.length) {
        throw new Error(
          "Sync Error: should not have changes to upload on First Sync"
        );
      }
      break;
    }
    case SyncType.LIGHT_SYNC:
    case SyncType.FULL_SYNC: {
      if (
        syncArgs.lastSyncTimestamp === null ||
        syncArgs.lastSyncTimestamp < MIN_SYNC_TIMESTAMP ||
        syncArgs.lastSyncTimestamp > MAX_SYNC_TIMESTAMP
      ) {
        const error = new Error("Sync Error: non valid lastSyncTimestamp");
        const augmentedError = CarbonError.fromAnyError(error)
          .addContextInfo("SYNC", "verifySyncArgs")
          .addAdditionalInfo({
            libError: `lastSyncTimestamp: ${syncArgs.lastSyncTimestamp}`,
          });
        sendExceptionLog({
          error: augmentedError,
        });
        throw error;
      }
      break;
    }
    default: {
      const error = new Error("Sync Error: unexpected syncType");
      const augmentedError = CarbonError.fromAnyError(error)
        .addContextInfo("SYNC", "verifySyncArgs")
        .addAdditionalInfo({
          libError: `syncType: ${syncArgs.syncType}`,
        });
      sendExceptionLog({ error: augmentedError });
      throw error;
    }
  }
}
