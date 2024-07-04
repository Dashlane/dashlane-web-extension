import { defineEvent, UseCaseScope } from '@dashlane/framework-contracts';
export class SessionClosingEvent extends defineEvent({
    scope: UseCaseScope.User,
}) {
}
