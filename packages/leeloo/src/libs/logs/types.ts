interface LogEntry {
}
export interface WebsiteLogEntry extends LogEntry {
    level?: 'info' | 'warn' | 'error';
    message: string;
    content: {
        [k: string]: any;
    };
}
export interface Logs {
    website: WebsiteLogEntry[];
}
export interface State extends Logs {
    flushLogsRequested: boolean;
    desktopAnonymousComputerId: string;
    device: string;
    websiteTrackingId: string;
    userAgent: string;
}
export default State;
export const makeEmptyLogs = (): Logs => ({
    website: [],
});
