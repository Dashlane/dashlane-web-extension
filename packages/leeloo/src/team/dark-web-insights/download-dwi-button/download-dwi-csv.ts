import { fromUnixTime } from 'date-fns';
import type { EmailIncidentInfo } from '@dashlane/communication';
import { downloadFile } from 'libs/file-download/file-download';
type DateFormatter = (date: Date) => string;
const createCSVHeader = () => {
    return (['email', 'domain', 'data_affected', 'incident_date', 'view_status'].join(',') + '\n');
};
const convertReportIntoCSV = (reports: EmailIncidentInfo[], dateFormatter: DateFormatter): string => {
    let csv = createCSVHeader();
    for (const report of reports) {
        for (const leak of report.leaks) {
            csv +=
                [
                    `"${report.email}"`,
                    `"${leak.domain}"`,
                    `"${leak.types.join(', ')}"`,
                    `"${dateFormatter(fromUnixTime(leak.breachDateUnix))}"`,
                    `"${report.viewStatus}"`,
                ].join(',') + '\n';
        }
    }
    return csv;
};
export const downloadDWIReportCSV = (reports: EmailIncidentInfo[], dateFormatter: DateFormatter) => {
    downloadFile(convertReportIntoCSV(reports, dateFormatter), 'DWI-report.csv', 'text/csv;charset=utf-8');
};
