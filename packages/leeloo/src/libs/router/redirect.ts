import { History } from 'history';
let historyReference: History | null = null;
interface RedirectOptions {
    push?: boolean;
}
const defaultRedirectOptions: RedirectOptions = {
    push: true,
};
export const setHistory = (history: History): void => {
    historyReference = history;
};
export const redirect = (route: string, options: RedirectOptions = defaultRedirectOptions): void => {
    if (historyReference) {
        if (options.push) {
            historyReference.push(route);
        }
        else {
            historyReference.replace(route);
        }
    }
};
