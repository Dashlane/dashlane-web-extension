import { defineEvent, UseCaseScope } from '@dashlane/framework-contracts';
export class SessionOpenedEvent extends defineEvent({
    scope: UseCaseScope.User,
}) {
}
