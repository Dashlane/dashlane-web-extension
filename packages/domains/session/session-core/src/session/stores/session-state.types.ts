export type SessionKey = {
    type: 'mp';
    masterPassword: string;
    secondaryKey?: string;
} | {
    type: 'sso';
    ssoKey: string;
};
interface OpenedSession {
    status: 'open';
    sessionKey: SessionKey;
    localKey: string | null;
}
interface OpeningSession {
    status: 'opening';
    sessionKey: SessionKey;
    localKey: string | null;
}
interface ClosedSession {
    status: 'closed';
    encryptedLocalKey: string | null;
}
export type SessionState = OpenedSession | ClosedSession | OpeningSession;
export type SessionsState = Record<string, SessionState>;
const isSessionState = (x: unknown): x is OpenedSession | ClosedSession => {
    if (!x || typeof x !== 'object') {
        return false;
    }
    return 'status' in x && (x.status === 'open' || x.status === 'closed');
};
export const isSessionsState = (x: unknown): x is SessionsState => {
    if (!x || !(typeof x === 'object')) {
        return false;
    }
    if (Object.keys(x).length === 0) {
        return true;
    }
    return Object.values(x).every((v) => isSessionState(v));
};
export type PersistedSessionState = {
    encryptedLocalKey: string | null;
};
export type PersistedSessionsState = Record<string, PersistedSessionState>;
