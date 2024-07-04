import { defineQuery, UseCaseScope } from '@dashlane/framework-contracts';
import { z } from 'zod';
export const SessionQueryParamsSchema = z.object({
    email: z.string(),
});
export type SessionQueryParams = z.infer<typeof SessionQueryParamsSchema>;
export enum SessionState {
    NotCreated = 'notCreated',
    Closed = 'closed',
    Open = 'open'
}
export class SessionStateQuery extends defineQuery<SessionState, never, SessionQueryParams>({
    scope: UseCaseScope.Device,
}) {
}
export enum CreatedSessionState {
    Closed = 'closed',
    Open = 'open'
}
export class CreatedSessionsStateQuery extends defineQuery<Record<string, CreatedSessionState>>({
    scope: UseCaseScope.Device,
}) {
}
