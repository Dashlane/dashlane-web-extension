import { Button as EventButtonLogType, UserClickEvent } from '@dashlane/hermes';
import { useState } from 'react';
import { Button, jsx, useToast } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { fetchDarkWebInsightsResults } from '../getDarkWebInsightsResults';
import { downloadDWIReportCSV } from './download-dwi-csv';
import { logEvent } from 'libs/logs/logEvent';
type DownloadDWIButtonProps = {
    domainName: string;
};
const REQUEST_SIZE = 10;
const BATCH_SIZE = 5;
const I18N_KEYS = {
    BUTTON: 'team_dark_web_insights_download_csv',
    SUCCESS: 'team_dark_web_insights_download_csv_success',
    ERROR: '_common_generic_error',
    DEFAULT_TOAST_ACTION: '_common_toast_close_label',
};
export const DownloadDWIButton = ({ domainName }: DownloadDWIButtonProps) => {
    const { showToast } = useToast();
    const [isDownloadingCsv, setIsDownloadingCSV] = useState(false);
    const [isOvertime, setIsOvertime] = useState(false);
    const { translate } = useTranslate();
    const downloadCSV = async () => {
        const allReports = [];
        const response = await fetchDarkWebInsightsResults(domainName, REQUEST_SIZE, 0);
        const remainingRequests = Math.ceil(response.emailsImpactedCount / REQUEST_SIZE);
        allReports.push(...response.emails);
        const batchRequests = async (currentRequestCount = 0) => {
            const requests = [];
            while (currentRequestCount < remainingRequests ||
                (remainingRequests - currentRequestCount) % BATCH_SIZE !== 0) {
                requests.push(fetchDarkWebInsightsResults(domainName, REQUEST_SIZE, currentRequestCount * REQUEST_SIZE));
                currentRequestCount += 1;
            }
            const responses = await Promise.all(requests);
            allReports.push(...responses.flatMap((res) => res.emails));
            if (currentRequestCount < remainingRequests) {
                batchRequests(currentRequestCount);
            }
        };
        await batchRequests(1);
        downloadDWIReportCSV(allReports, translate.shortDate);
    };
    const onDownloadClick = async () => {
        let timer;
        try {
            logEvent(new UserClickEvent({ button: EventButtonLogType.DownloadCsv }));
            setIsDownloadingCSV(true);
            timer = setTimeout(() => {
                setIsOvertime(true);
            }, 2000);
            await downloadCSV();
            showToast({
                description: translate(I18N_KEYS.SUCCESS),
                closeActionLabel: translate(I18N_KEYS.DEFAULT_TOAST_ACTION),
            });
        }
        catch (e) {
            showToast({
                description: translate(I18N_KEYS.ERROR),
                mood: 'danger',
                closeActionLabel: translate(I18N_KEYS.DEFAULT_TOAST_ACTION),
            });
        }
        finally {
            clearTimeout(timer);
            setIsDownloadingCSV(false);
            setIsOvertime(false);
        }
    };
    return (<Button mood="neutral" intensity="quiet" layout="iconLeading" onClick={onDownloadClick} icon="DownloadOutlined" disabled={isDownloadingCsv} isLoading={isOvertime}>
      {translate(I18N_KEYS.BUTTON)}
    </Button>);
};
