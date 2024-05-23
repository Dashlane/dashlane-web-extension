import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { tabsCreate, tabsGetCurrent, tabsRemove, tabsUpdate, } from '@dashlane/webextensions-apis';
import { AlertSeverity } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router';
import { useHistory } from 'react-router-dom';
import { useImportPreviewContext } from 'webapp/import-data/hooks/useImportPreviewContext';
import { ImportDataRoutes } from 'webapp/import-data/routes';
import { useLastPassEffects } from './use-last-pass-effects';
import { parseLastPassItemsIntoCsv } from './utils';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { BackupFileType, ImportDataDropAction, ImportDataStatus, ImportDataStep, ImportSource, PageView, UserImportDataEvent, } from '@dashlane/hermes';
import { LastPassLoginPending } from './last-pass-login-pending';
import { useNavigateAwayListener } from 'webapp/import-data/hooks/use-navigate-away-listener';
import { logDirectImportFailed } from 'webapp/import-data/logs';
import { UnlockLastPassVault } from './unlock-lastpass-vault';
const lastPassCookieName = 'PHPSESSID';
const lastPassLoginUrl = '*****';
const lastPassIterationsUrl = '*****';
const lastPassDataUrl = '*****';
const I18N_KEYS = {
    SUCCESS_TOAST: 'webapp_account_import_direct_import_success_toast',
    LAST_PASS_SOURCE: 'webapp_account_import_source_label_lastpass',
    STEPS: {
        STEP_TITLE: 'webapp_account_import_select_direct_title',
        STEP_ONE: 'webapp_account_import_select_direct_step1',
        STEP_TWO: 'webapp_account_import_select_direct_step2',
        STEP_THREE: 'webapp_account_import_select_csv_preview_step3',
    },
    HELP_TIP_INFOBOX: 'webapp_account_import_help_tip_infobox_markup',
};
const I18N_ERRORS = {
    GENERIC: '_common_generic_error',
};
const DEFAULT_ITERATIONS = 100100;
export const DirectImportLastPass = () => {
    const [error, setError] = useState('');
    const [currentTabId, setCurrentTabId] = useState(0);
    const [openedTabId, setOpenedTabId] = useState(0);
    const [vaultXML, setVaultXML] = useState<Document | null>(null);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const alert = useAlert();
    const { translate } = useTranslate();
    const { preview: { processFile }, importSource, } = useImportPreviewContext();
    const { routes } = useRouterGlobalSettingsContext();
    const history = useHistory();
    const dataLoaded = !!vaultXML;
    const { listenForLastPassCookie, cookieData } = useLastPassEffects();
    useNavigateAwayListener({
        importSource,
        importStep: dataLoaded
            ? ImportDataStep.DecryptLastpassVault
            : ImportDataStep.LoginToLastpass,
        isDirectImport: true,
    });
    useEffect(() => {
        const setCurrentTab = async () => {
            const currentTab = await tabsGetCurrent();
            if (currentTab?.id) {
                setCurrentTabId(currentTab.id);
            }
        };
        setCurrentTab();
    }, []);
    useEffect(() => {
        if (dataLoaded) {
            logPageView(PageView.ImportCsvDecryptLastpassVault);
        }
    }, [dataLoaded]);
    const openLastPassLoginTab = () => {
        tabsCreate({
            url: `${lastPassLoginUrl}&email=${login}`,
            active: true,
        }).then((tab) => {
            setOpenedTabId(tab.id ?? 0);
        });
    };
    useEffect(() => {
        listenForLastPassCookie();
        openLastPassLoginTab();
    }, []);
    const fetchLastPassIterations = async () => {
        return await fetch(`${lastPassIterationsUrl}?email=${login}`, {
            method: 'GET',
            headers: {
                Cookie: `${lastPassCookieName}=${cookieData}`,
            },
        })
            .then((response) => response.text())
            .then((iterations) => {
            const iterationCount = parseInt(iterations, 10);
            if (isNaN(iterationCount)) {
                return DEFAULT_ITERATIONS;
            }
            return iterationCount;
        })
            .catch(() => {
            return DEFAULT_ITERATIONS;
        });
    };
    const fetchLastPassData = useCallback(() => {
        if (dataLoaded) {
            return;
        }
        fetch(lastPassDataUrl, {
            method: 'GET',
            headers: {
                Cookie: `${lastPassCookieName}=${cookieData}`,
            },
        })
            .then((response) => response.text())
            .then((vaultXMLString) => {
            const parser = new DOMParser();
            const vaultXMLDoc = parser.parseFromString(vaultXMLString, 'application/xml');
            const errorNode = vaultXMLDoc.querySelector('parsererror');
            if (errorNode) {
                logDirectImportFailed(BackupFileType.Csv, importSource, ImportDataStep.DecryptLastpassVault, ImportDataStatus.FailedToDecryptVault);
                setError(translate(I18N_ERRORS.GENERIC));
            }
            else {
                setVaultXML(vaultXMLDoc);
                if (currentTabId) {
                    tabsUpdate(currentTabId, {
                        active: true,
                    });
                }
                if (openedTabId) {
                    tabsRemove([openedTabId]);
                    alert.showAlert(translate(I18N_KEYS.SUCCESS_TOAST, {
                        source: 'LastPass',
                    }), AlertSeverity.SUCCESS);
                }
            }
        })
            .catch(() => {
            logDirectImportFailed(BackupFileType.Csv, importSource, ImportDataStep.DecryptLastpassVault, ImportDataStatus.FailedToFetchVault);
            setError(translate(I18N_ERRORS.GENERIC));
        });
    }, [cookieData, currentTabId, dataLoaded, openedTabId, translate]);
    useEffect(() => {
        if (cookieData) {
            fetchLastPassData();
        }
    }, [cookieData, fetchLastPassData]);
    const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };
    const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };
    const handleBackButtonClick = () => {
        logEvent(new UserImportDataEvent({
            backupFileType: BackupFileType.Csv,
            importSource: ImportSource.SourceLastpass,
            importDataStep: dataLoaded
                ? ImportDataStep.DecryptLastpassVault
                : ImportDataStep.LoginToLastpass,
            importDataStatus: ImportDataStatus.ImportFlowTerminated,
            importDataDropAction: ImportDataDropAction.CancelProcess,
            isDirectImport: true,
        }));
        history.push(`${routes.importData}/${ImportDataRoutes.ImportSource}`);
    };
    const processLastPassData = async (e: SyntheticEvent) => {
        e.preventDefault();
        try {
            if (!dataLoaded || !login || !password) {
                setError(translate(I18N_ERRORS.GENERIC));
                return;
            }
            const iterations = await fetchLastPassIterations();
            const lastPassCsvFile = await parseLastPassItemsIntoCsv(login, password, iterations, vaultXML);
            processFile(lastPassCsvFile);
        }
        catch {
            logDirectImportFailed(BackupFileType.Csv, importSource, ImportDataStep.DecryptLastpassVault, ImportDataStatus.FailedToDecryptVault);
            setError(translate(I18N_ERRORS.GENERIC));
        }
    };
    return !dataLoaded ? (<LastPassLoginPending error={error} openLastPassLoginTab={openLastPassLoginTab} handleBackButtonClick={handleBackButtonClick}/>) : (<UnlockLastPassVault processLastPassData={processLastPassData} error={error} handleBackButtonClick={handleBackButtonClick} handleLoginInputChange={handleLoginInputChange} handlePasswordInputChange={handlePasswordInputChange} login={login} password={password}/>);
};
