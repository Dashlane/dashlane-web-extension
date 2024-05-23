import WebsiteLog from 'libs/api/WebsiteLog';
import { WebsiteLogEntry } from 'libs/logs/types';
import { ExtraParams } from 'libs/logs/send';
import { carbonConnector } from 'libs/carbon/connector';
const MAX_EXCEPTION_COUNT_PER_TYPE_PER_SESSION = 10;
let logExceptionsCount: {
    [key: string]: number;
} = {};
export const clearExceptionsCountCache = () => {
    logExceptionsCount = {};
};
const rawSendWebsiteLog = (log: WebsiteLogEntry, extra: ExtraParams): Promise<null> => new WebsiteLog()
    .create({
    level: '' + log.level,
    message: log.message,
    data: {
        ...log.content,
        userAgent: extra.userAgent,
        sessionId: extra.sessionId,
    },
})
    .then(() => null);
function limitExceptionPerType(log: WebsiteLogEntry, limit: number, fn: Function) {
    const cacheKey = log.message || 'UNKNOWN_EXCEPTION';
    logExceptionsCount[cacheKey] = logExceptionsCount[cacheKey] || 0;
    logExceptionsCount[cacheKey]++;
    if (logExceptionsCount[cacheKey] > limit) {
        console.log('Exception sent too many times, stop reporting it', log);
        return;
    }
    return fn();
}
export const sendWebsiteLogs = async (logs: WebsiteLogEntry[], extra: ExtraParams): Promise<null> => {
    const globalExtensionSettings = await carbonConnector.getGlobalExtensionSettings();
    const allowedToLog = globalExtensionSettings.interactionDataConsent !== false;
    if (!allowedToLog) {
        return null;
    }
    return Promise.all(logs.map((log) => limitExceptionPerType(log, MAX_EXCEPTION_COUNT_PER_TYPE_PER_SESSION, () => rawSendWebsiteLog(log, extra)))).then(() => null);
};
