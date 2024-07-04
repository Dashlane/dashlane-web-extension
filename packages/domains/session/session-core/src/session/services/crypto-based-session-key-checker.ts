import { Injectable } from '@dashlane/framework-application';
import { assertUnreachable, Result, success } from '@dashlane/framework-types';
import { CheckSessionSessionNotCreated, SessionKeyChecker, } from '@dashlane/session-contracts';
import { SessionKey } from '../stores/session-state.types';
import { SessionsStateStore } from '../stores/sessions-state.store';
import { firstValueFrom } from 'rxjs';
import { base64ToArrayBuffer } from '@dashlane/framework-encoding';
import { SessionKeyVerifier } from '../session-key/session-key-verifier';
export function checkSkEquality(a: SessionKey, b: SessionKey): boolean {
    switch (a.type) {
        case 'mp':
            return (b.type === 'mp' &&
                a.masterPassword === b.masterPassword &&
                a.secondaryKey === b.secondaryKey);
        case 'sso':
            return b.type === 'sso' && a.ssoKey === b.ssoKey;
        default:
            assertUnreachable(a);
    }
}
@Injectable()
export class CryptoBasedSessionKeyChecker extends SessionKeyChecker {
    constructor(private sessionsStateStore: SessionsStateStore, private verifier: SessionKeyVerifier) {
        super();
    }
    async checkSessionKey(email: string, sessionKey: SessionKey): Promise<Result<boolean, CheckSessionSessionNotCreated>> {
        if (sessionKey.type !== 'mp') {
            return success(true);
        }
        const state = await firstValueFrom(this.sessionsStateStore.state$);
        if (!(email in state)) {
            return success(true);
        }
        const session = state[email];
        if (session.status === 'open' || session.status === 'opening') {
            return success(checkSkEquality(session.sessionKey, sessionKey));
        }
        if (!session.encryptedLocalKey) {
            return success(true);
        }
        const encryptedLocalKey = base64ToArrayBuffer(session.encryptedLocalKey);
        return success(await this.verifier.verify(encryptedLocalKey, sessionKey));
    }
}
