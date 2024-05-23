import { carbonConnector } from 'src/carbonConnector';
export function updateProtectPasswordsSetting(protectPasswordsSetting: boolean) {
    return carbonConnector.updateProtectPasswordsSetting(protectPasswordsSetting);
}
