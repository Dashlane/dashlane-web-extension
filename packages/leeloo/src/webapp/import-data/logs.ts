import { ImportFormats, ImportSource } from '@dashlane/communication';
import { BackupFileType, HelpCenterArticleCta, ImportDataDropAction, ImportDataStatus, ImportDataStep, Space, UserImportDataEvent, UserOpenHelpCenterEvent, } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
import { ImportSourcesToLogSources } from './types';
const TO_LOG_EVENT: Record<ImportFormats, BackupFileType> = {
    [ImportFormats.Csv]: BackupFileType.Csv,
    [ImportFormats.Dash]: BackupFileType.SecureVault,
};
export const logWrongDashArchivePassword = () => {
    logEvent(new UserImportDataEvent({
        backupFileType: BackupFileType.SecureVault,
        importDataStatus: ImportDataStatus.WrongFilePassword,
        importSource: ImportSourcesToLogSources[ImportSource.Dash],
        importDataStep: ImportDataStep.SelectFile,
        isDirectImport: false,
    }));
};
export const logInvalidFile = (fileFormat: ImportFormats, importSource: ImportSource) => {
    logEvent(new UserImportDataEvent({
        backupFileType: TO_LOG_EVENT[fileFormat],
        importDataStatus: ImportDataStatus.WrongFileStructure,
        importSource: ImportSourcesToLogSources[importSource],
        importDataStep: ImportDataStep.SelectFile,
        isDirectImport: false,
    }));
};
export const logImportFailure = (backupFileType: BackupFileType, importSource: ImportSource, attemptedItemCount: number, isDirectImport: boolean) => {
    logEvent(new UserImportDataEvent({
        backupFileType: backupFileType,
        importDataStatus: ImportDataStatus.FailureDuringImport,
        importSource: ImportSourcesToLogSources[importSource],
        importDataStep: ImportDataStep.PreviewItemsToImport,
        itemsToImportCount: attemptedItemCount,
        isDirectImport: isDirectImport,
    }));
};
export const logImportFlowTerminated = (importSource: ImportSource, attemptedItemCount: number, isDirectImport: boolean) => {
    logEvent(new UserImportDataEvent({
        importSource: ImportSourcesToLogSources[importSource],
        itemsToImportCount: attemptedItemCount,
        backupFileType: BackupFileType.Csv,
        importDataStatus: ImportDataStatus.ImportFlowTerminated,
        importDataStep: ImportDataStep.PreviewItemsToImport,
        importDataDropAction: ImportDataDropAction.CancelProcess,
        isDirectImport: isDirectImport,
    }));
};
export const logImportSuccess = (backupFileType: BackupFileType, importSource: ImportSource, importedItemsCount: number, totalAttemptedCount: number, space: Space, isDirectImport: boolean) => {
    logEvent(new UserImportDataEvent({
        importSource: ImportSourcesToLogSources[importSource],
        importedItemsCount: importedItemsCount,
        backupFileType: backupFileType,
        importDataStatus: ImportDataStatus.Success,
        itemsToImportCount: totalAttemptedCount,
        space: space,
        importDataStep: ImportDataStep.Success,
        isDirectImport: isDirectImport,
    }));
};
export const logHelpCenterEvent = (helpCenterCta: HelpCenterArticleCta) => {
    logEvent(new UserOpenHelpCenterEvent({
        helpCenterArticleCta: helpCenterCta,
    }));
};
export const logDirectImportFailed = (backupFileType: BackupFileType, importSource: ImportSource, importDataStep: ImportDataStep, importDataStatus: ImportDataStatus) => {
    logEvent(new UserImportDataEvent({
        backupFileType: backupFileType,
        importSource: ImportSourcesToLogSources[importSource],
        importDataStep: importDataStep,
        importDataStatus: importDataStatus,
        isDirectImport: true,
    }));
};
export const logImportStart = (backupFileType: BackupFileType, importSource: ImportSource, importDataStep: ImportDataStep, isDirectImport: boolean) => {
    logEvent(new UserImportDataEvent({
        backupFileType: backupFileType,
        importSource: ImportSourcesToLogSources[importSource],
        importDataStep: importDataStep,
        importDataStatus: ImportDataStatus.Start,
        isDirectImport: isDirectImport,
    }));
};
