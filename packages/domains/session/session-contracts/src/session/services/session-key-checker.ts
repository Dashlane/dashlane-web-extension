import { FunctionalError, Result } from '@dashlane/framework-types';
import { SessionKey } from '../session.types';
export enum CheckSessionKeyErrorTypes {
    SessionNotCreated = 'notCreated'
}
export class CheckSessionSessionNotCreated extends FunctionalError(CheckSessionKeyErrorTypes.SessionNotCreated, 'The session has not been created. Create it first.') {
}
export type CheckSessionKeyErrors = CheckSessionSessionNotCreated;
export abstract class SessionKeyChecker {
    public abstract checkSessionKey(email: string, sessionKey: SessionKey): Promise<Result<boolean, CheckSessionKeyErrors>>;
}
