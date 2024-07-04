import { defineEvent, UseCaseScope } from '@dashlane/framework-contracts';
export class MasterPasswordChangedEvent extends defineEvent({
    scope: UseCaseScope.User,
}) {
}
