import { Injectable } from '@dashlane/framework-application';
import { success } from '@dashlane/framework-types';
import { map } from 'rxjs';
import { SessionsCryptoSettingsState, SessionsCryptoSettingsStore, } from '../stores/sessions-crypto-settings.store';
@Injectable()
export class SessionKeyCryptoSettingsRepository {
    constructor(private sessionsCryptoSettingsStore: SessionsCryptoSettingsStore) { }
    public getConfig(login: string) {
        return this.sessionsCryptoSettingsStore.state$.pipe(map((sessionsCryptoSettings: SessionsCryptoSettingsState) => {
            if (login in sessionsCryptoSettings) {
                const { derivation, salt } = sessionsCryptoSettings[login];
                return success({
                    derivation,
                    salt,
                });
            }
            else {
                throw new Error('No crypto settings found for this user');
            }
        }));
    }
}
