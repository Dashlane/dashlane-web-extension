import {
  BaseDataModelObject,
  DataModelObject,
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY,
  TRANSACTION_TYPE_TO_DATAMODEL_TYPE,
  TransactionType,
  transactionTypes,
} from "@dashlane/communication";
import { difference, pluck } from "ramda";
import { PersonalData } from "Session/Store/personalData/types";
import { UploadChange } from "Libs/Backup/Upload/UploadChange";
import { SyncSummary } from "Libs/WS/Backup/types";
import {
  announcements,
  AnnounceSync,
  TreatProblemSummaryComparedCause,
  TreatProblemSummaryComparedResult,
} from "Libs/Backup/Probe";
import { createUploadChange } from "Libs/Backup/Upload/UploadChange/upload-change.factories";
export interface MissingObjectsFromSummary {
  missingLocally: string[];
  missingRemotely: UploadChange[];
}
function getMissingIdentifiersForType(
  announce: AnnounceSync,
  transactionType: TransactionType,
  state: PersonalData,
  summary: SyncSummary
): MissingObjectsFromSummary {
  const dataModelType = TRANSACTION_TYPE_TO_DATAMODEL_TYPE[transactionType];
  if (
    !dataModelType ||
    !DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[dataModelType]
  ) {
    return {
      missingLocally: [],
      missingRemotely: [],
    };
  }
  const type = DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[dataModelType];
  if (!state[type]) {
    return {
      missingLocally: [],
      missingRemotely: [],
    };
  }
  const remoteObjects = summary.transactions[transactionType] || {};
  const idsOfItemsWithChanges = new Set(
    state.changesToUpload
      .filter(({ kwType }) => kwType === dataModelType)
      .map(({ itemId }) => itemId)
  );
  const localObjects: BaseDataModelObject[] = state[type].filter(
    ({ Id }: BaseDataModelObject) => !idsOfItemsWithChanges.has(Id)
  );
  const remoteObjectIds = Object.keys(remoteObjects).filter(
    (id) => !idsOfItemsWithChanges.has(id)
  );
  const initialMissingLocally = difference(
    remoteObjectIds,
    pluck("Id", localObjects)
  );
  initialMissingLocally.forEach((Id) => {
    announce(
      announcements.treatProblemSummaryCompared(
        TreatProblemSummaryComparedResult.Download,
        transactionType,
        Id,
        {
          cause: TreatProblemSummaryComparedCause.Missing,
          remoteDate: remoteObjects[Id],
        }
      )
    );
  });
  const comparedAnnouncement = announcements.treatProblemSummaryCompared;
  return localObjects.reduce(
    (
      missingObjects: MissingObjectsFromSummary,
      { Id, LastBackupTime }: DataModelObject
    ) => {
      const remoteBackupTimeMs = remoteObjects[Id];
      const localDate = LastBackupTime * 1000;
      if (!remoteBackupTimeMs || remoteBackupTimeMs / 1000 < LastBackupTime) {
        const remoteDate = remoteBackupTimeMs
          ? { remoteDate: remoteBackupTimeMs }
          : {};
        announce(
          comparedAnnouncement(
            TreatProblemSummaryComparedResult.Upload,
            transactionType,
            Id,
            {
              cause: remoteBackupTimeMs
                ? TreatProblemSummaryComparedCause.OutOfDate
                : TreatProblemSummaryComparedCause.Missing,
              localDate,
              ...remoteDate,
            }
          )
        );
        const toUpload = createUploadChange({
          action: "EDIT",
          kwType: dataModelType,
          itemId: Id,
        });
        return {
          missingLocally: missingObjects.missingLocally,
          missingRemotely: [...missingObjects.missingRemotely, toUpload],
        };
      } else if (remoteBackupTimeMs / 1000 > LastBackupTime) {
        announce(
          comparedAnnouncement(
            TreatProblemSummaryComparedResult.Download,
            transactionType,
            Id,
            {
              cause: TreatProblemSummaryComparedCause.OutOfDate,
              localDate,
              remoteDate: remoteBackupTimeMs,
            }
          )
        );
        return {
          missingLocally: [...missingObjects.missingLocally, Id],
          missingRemotely: missingObjects.missingRemotely,
        };
      } else {
        announce(
          comparedAnnouncement(
            TreatProblemSummaryComparedResult.UpToDate,
            transactionType,
            Id,
            {
              localDate,
            }
          )
        );
      }
      return missingObjects;
    },
    {
      missingLocally: initialMissingLocally,
      missingRemotely: [],
    }
  );
}
export function getMissingIdentifiers(
  announce: AnnounceSync,
  state: PersonalData,
  summary: SyncSummary
): MissingObjectsFromSummary {
  const mergeMissingObjects = (
    missing1: MissingObjectsFromSummary,
    missing2: MissingObjectsFromSummary
  ): MissingObjectsFromSummary => {
    return {
      missingLocally: [...missing1.missingLocally, ...missing2.missingLocally],
      missingRemotely: [
        ...missing1.missingRemotely,
        ...missing2.missingRemotely,
      ],
    };
  };
  announce(announcements.treatProblemSummaryStarted(state, summary));
  const comparisonResult = transactionTypes.reduce(
    (result, transactionType) => {
      return mergeMissingObjects(
        result,
        getMissingIdentifiersForType(announce, transactionType, state, summary)
      );
    },
    { missingLocally: [], missingRemotely: [] }
  );
  announce(announcements.treatProblemSummaryFinished());
  return comparisonResult;
}
