import { defineEvent, UseCaseScope } from '@dashlane/framework-contracts';
export enum SessionCloseMode {
    Close = 'close',
    Lock = 'lock'
}
export interface SessionCloseEventParams {
    mode: SessionCloseMode;
    email: string;
}
export class SessionClosedEvent extends defineEvent<SessionCloseEventParams>({
    scope: UseCaseScope.Device,
}) {
}
