import { LOG } from 'root/init/logging';
import { websiteLogAction } from '.';
import { WebsiteLogEntry } from './types';
const getCurrentPageScripts = function () {
    return Array.prototype.map.call(window.document.querySelectorAll('script'), (script: HTMLScriptElement) => script.src ||
        script.getAttribute('src') ||
        (script.textContent ? script.textContent.trim().substr(0, 200) : ''));
};
type ErrorAction = {
    type: string;
    params: WebsiteLogEntry;
};
interface ErrorActionCreator {
    (error: Error): ErrorAction;
    (message: string, error: Error): ErrorAction;
}
const errorAction: ErrorActionCreator = function (messageOrError: Error | string, error?: Error) {
    const [message, errorObject] = typeof messageOrError === 'string'
        ? [messageOrError, error]
        : [messageOrError.message, messageOrError ?? error];
    if (LOG) {
        console.warn(message.replace(/:$/, '') + ':');
        console.error(errorObject ?? new Error(message));
    }
    const content: {
        [k: string]: unknown;
    } = {};
    if (errorObject) {
        Object.getOwnPropertyNames(errorObject)
            .filter((k) => k !== 'message')
            .forEach((k) => (content[k] = errorObject[k]));
    }
    return websiteLogAction.error({
        message,
        content: {
            ...content,
            version: VERSION,
            scripts: getCurrentPageScripts(),
            hostname: window.location.hostname,
            host: window.location.host,
            pathname: window.location.pathname,
        },
    });
};
export default errorAction;
