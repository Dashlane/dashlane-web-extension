import { Lee } from 'lee';
import { useCallback, useRef, useState } from 'react';
import { useInfiniteScroll } from 'libs/hooks/useInfiniteScroll';
import { AlertSeverity, LoadingIcon } from '@dashlane/ui-components';
import { Button, jsx } from '@dashlane/design-system';
import { AuditLogDownloadError, FlowStep, PageView, UserDownloadAuditLogsDataEvent, } from '@dashlane/hermes';
import { ActivityLog } from '@dashlane/risk-monitoring-contracts';
import Activity from 'team/activity';
import useTranslate from 'libs/i18n/useTranslate';
import { addNotification, removeNotification, } from 'libs/notifications/actions';
import { Notification } from 'libs/notifications/types';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { downloadFile } from 'libs/file-download/file-download';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { ActivityDescription } from './logs-table/activity-description';
import { getAuditLogView } from './audit-logs/getAuditLogView';
import { LogsTable, LogsTableRow } from './logs-table';
import { fetchAuditLogsPages, startAuditLogsQuery, } from './fetchAuditLogsPages';
import { useInfiniteScrollAuditLogs } from './useInfiniteScrollAuditLogs';
import { DownloadCSVDialog } from './download-csv/download-csv-dialog';
import { getAuditLogsCSVContent } from './download-csv/getAuditLogsCSVContent';
import { AuditLogView } from './types';
import styles from './styles.css';
export const I18N_KEYS = {
    DOWNLOAD_CSV_ALERT_ERROR: 'team_activity_download_modal_alert_error',
    DOWNLOAD_CSV_ALERT_RETRY: 'team_activity_download_modal_alert_action',
    DOWNLOAD_CSV_ALERT_DISMISS: '_common_alert_dismiss_button',
    DOWNLOAD_CSV_BUTTON: 'team_activity_download_button',
    GENERIC_ERROR: '_common_generic_error',
};
const downloadErrorNotification = (lee: Lee, handleButtonClick: () => Promise<void>): Notification => {
    const key = 'directorySyncKeyValidationError';
    const handleClose = () => lee.dispatchGlobal(removeNotification(key));
    const level = AlertSeverity.ERROR;
    const textKey = I18N_KEYS.DOWNLOAD_CSV_ALERT_ERROR;
    const buttonTextKey = I18N_KEYS.DOWNLOAD_CSV_ALERT_RETRY;
    const errorNotification: Notification = {
        key,
        level,
        textKey,
        handleClose,
        handleButtonClick: () => {
            handleButtonClick();
            handleClose();
        },
        buttonTextKey,
    };
    return errorNotification;
};
interface Props {
    lee: Lee;
}
const DOWNLOAD_FINISHED_DELAY = 1000;
export const AuditLogs = ({ lee }: Props) => {
    const { translate } = useTranslate();
    const [nextTokenVal, setNextTokenVal] = useState('');
    const { isStartAuditLogsQueryTriggered, isLoading, nextToken, hasError, list, } = useInfiniteScrollAuditLogs(nextTokenVal);
    const isFirstPageLoad = !isStartAuditLogsQueryTriggered && isLoading;
    const isNotFirstPageLoad = isStartAuditLogsQueryTriggered && isLoading;
    const hasMore = nextToken !== null;
    const onLoadMore = () => {
        if (hasMore) {
            setNextTokenVal(nextToken);
        }
    };
    const containerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    useInfiniteScroll({
        hasMore,
        scrollContainerRef: containerRef,
        bottomRef,
        loadMore: onLoadMore,
    });
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadModalOpen, setDownloadModalOpen] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const alert = useAlert();
    const closeDialog = useCallback(() => {
        setDownloadModalOpen(false);
        logPageView(PageView.TacActivityList);
    }, []);
    const fetchPageCompleted = useCallback((pageNumber: number) => {
        const fivePercent = pageNumber * 5;
        const onePercent = 50 + pageNumber - 10;
        if (pageNumber <= 10) {
            setDownloadProgress(fivePercent);
        }
        else if (pageNumber <= 40 && pageNumber > 10) {
            setDownloadProgress(onePercent);
        }
    }, []);
    const startDownload = async () => {
        setDownloadModalOpen(true);
        setDownloadProgress(0);
        setIsDownloading(true);
        logPageView(PageView.TacActivityDownload);
        logEvent(new UserDownloadAuditLogsDataEvent({
            flowStep: FlowStep.Start,
            auditLogCount: 0,
        }));
        try {
            let auditLogs: ActivityLog[] = [];
            const res = await startAuditLogsQuery();
            auditLogs = await fetchAuditLogsPages(fetchPageCompleted, res.data.queryExecutionId);
            setDownloadProgress(100);
            const UTF8_BOM = '\ufeff';
            const csv = getAuditLogsCSVContent(auditLogs, translate);
            setTimeout(() => {
                try {
                    downloadFile([UTF8_BOM, csv], 'dashlane-activity-export.csv', 'text/csv;charset=utf-8');
                    setIsDownloading(false);
                    closeDialog();
                }
                catch (e) {
                    logEvent(new UserDownloadAuditLogsDataEvent({
                        flowStep: FlowStep.Error,
                        auditLogDownloadError: AuditLogDownloadError.NoCsv,
                    }));
                }
            }, DOWNLOAD_FINISHED_DELAY);
        }
        catch (e) {
            lee.dispatchGlobal(addNotification(downloadErrorNotification(lee, startDownload)));
            logEvent(new UserDownloadAuditLogsDataEvent({
                flowStep: FlowStep.Error,
                auditLogDownloadError: AuditLogDownloadError.UnexpectedUnknown,
            }));
            setDownloadProgress(0);
            setIsDownloading(false);
            closeDialog();
        }
    };
    const displayLogs = list
        .map((log) => getAuditLogView(log, translate))
        .filter((view) => view !== null) as AuditLogView[];
    return (<Activity isLoading={!downloadModalOpen && isFirstPageLoad}>
      <div className={styles.container} ref={containerRef}>
        <div className={styles.top}>
          <Button onClick={startDownload} disabled={isDownloading} layout="iconLeading" icon="DownloadOutlined">
            {translate(I18N_KEYS.DOWNLOAD_CSV_BUTTON)}
          </Button>
        </div>
        <LogsTable>
          {displayLogs.map((logView) => (<LogsTableRow login={logView.userLogin} action={<ActivityDescription text={logView.activityDescription}/>} date={logView.date} key={logView.uuid}/>))}
        </LogsTable>
        {hasError
            ? alert.showAlert(translate(I18N_KEYS.GENERIC_ERROR), AlertSeverity.ERROR)
            : null}

        <div ref={bottomRef}>
          {isNotFirstPageLoad ? (<div sx={{
                display: 'flex',
                height: '40px',
                justifyContent: 'center',
                paddingTop: '20px',
                paddingBottom: '60px',
            }}>
              <LoadingIcon size={40} color={'ds.text.brand.quiet'}/>
            </div>) : null}
        </div>
      </div>
      {downloadModalOpen ? (<DownloadCSVDialog isOpen={downloadModalOpen} progress={downloadProgress} onClose={() => {
                closeDialog();
            }}/>) : null}
    </Activity>);
};
