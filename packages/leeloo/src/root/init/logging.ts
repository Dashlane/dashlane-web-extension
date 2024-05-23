import { parseLocationParams } from '@offirmo/simple-querystring-parser';
export let LOG = false;
export let LOG_STORE_ACTIONS = false;
export default function initLogging() {
    const SESSION_STORAGE_KEY_VERBOSE = 'kw_verbose';
    const queryParams = parseLocationParams(window.location);
    if ('verbose' in queryParams) {
        sessionStorage.setItem(SESSION_STORAGE_KEY_VERBOSE, 'true');
    }
    const shouldLog = sessionStorage.getItem(SESSION_STORAGE_KEY_VERBOSE) === 'true';
    if (shouldLog) {
        console.info('~~~ Logs activated ~~~');
    }
    LOG = DEFAULT_LOG_FLAGS.LOG || shouldLog;
    LOG_STORE_ACTIONS = DEFAULT_LOG_FLAGS.LOG_STORE_ACTIONS || shouldLog;
    (window as any).KW_LOG = LOG;
}
