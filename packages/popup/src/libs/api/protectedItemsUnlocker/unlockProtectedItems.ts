import { carbonConnector } from 'src/carbonConnector';
export function unlockProtectedItems(masterPassword: string) {
    return carbonConnector.unlockProtectedItems(masterPassword);
}
