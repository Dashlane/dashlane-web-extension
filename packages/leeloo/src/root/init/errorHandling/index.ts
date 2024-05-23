import { Store } from 'redux';
import { GlobalState } from 'store/types';
import errorAction from 'libs/logs/errorActions';
export default function (w: Window, store: Store<GlobalState>) {
    w.addEventListener('error', (event: ErrorEvent) => {
        event.preventDefault();
        if (event.message === 'ResizeObserver loop limit exceeded') {
            event.stopPropagation();
            return;
        }
        store.dispatch(errorAction(event.message, event.error));
    });
    w.onunhandledrejection = (event: PromiseRejectionEvent) => {
        if (event.preventDefault) {
            event.preventDefault();
        }
        const reason = event.reason;
        const error = reason instanceof Error
            ? reason
            : new Error('Promise rejection reason is not an error, but is "' +
                JSON.stringify(reason) +
                '" instead');
        store.dispatch(errorAction(`Unhandled promise rejection: ${error}`, error));
    };
}
