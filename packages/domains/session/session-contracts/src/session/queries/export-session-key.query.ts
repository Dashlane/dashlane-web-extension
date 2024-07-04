import { defineQuery, UseCaseScope } from '@dashlane/framework-contracts';
export interface ExportedSessionKey {
    type: 'exported';
    content: string;
}
export class ExportSessionKeyQuery extends defineQuery<ExportedSessionKey>({
    scope: UseCaseScope.User,
}) {
}
