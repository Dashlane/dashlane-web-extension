import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BackupFileType, ImportDataDropAction, ImportDataStatus, ImportDataStep, UserImportDataEvent, } from '@dashlane/hermes';
import { ImportSource } from '@dashlane/communication';
import { logEvent } from 'libs/logs/logEvent';
import { ImportSourcesToLogSources } from '../types';
import { ImportDataRoutes } from '../routes';
import { useRouterGlobalSettingsContext } from 'libs/router';
interface UseNavigateListenerProps {
    importStep: ImportDataStep;
    importSource: ImportSource;
    isDirectImport: boolean;
    itemsToImportCount?: number;
}
export const useNavigateAwayListener = ({ importStep, importSource, isDirectImport, itemsToImportCount, }: UseNavigateListenerProps) => {
    const history = useHistory();
    const routerContext = useRouterGlobalSettingsContext();
    const importDataRoutes = Object.values(ImportDataRoutes).map((route) => `${routerContext.routes.importData}/${route}`);
    const backupFileType = importSource === ImportSource.Dash
        ? BackupFileType.SecureVault
        : BackupFileType.Csv;
    useEffect(() => {
        const unListen = history.listen(() => {
            if (!importDataRoutes.includes(history.location.pathname)) {
                logEvent(new UserImportDataEvent({
                    backupFileType: backupFileType,
                    importDataStatus: ImportDataStatus.ImportFlowTerminated,
                    importSource: ImportSourcesToLogSources[importSource],
                    importDataDropAction: ImportDataDropAction.SwitchedWebappSection,
                    importDataStep: importStep,
                    itemsToImportCount: itemsToImportCount,
                    isDirectImport: isDirectImport,
                }));
            }
        });
        return unListen;
    }, []);
    useEffect(() => {
        const beforeUnload = () => {
            logEvent(new UserImportDataEvent({
                backupFileType: backupFileType,
                importDataStatus: ImportDataStatus.ImportFlowTerminated,
                importSource: ImportSourcesToLogSources[importSource],
                importDataDropAction: ImportDataDropAction.ShutDownBrowserTab,
                importDataStep: importStep,
                itemsToImportCount: itemsToImportCount,
                isDirectImport: isDirectImport,
            }));
        };
        window.addEventListener('beforeunload', beforeUnload);
        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        };
    }, []);
};
