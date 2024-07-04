import { defineCommand, UseCaseScope } from '@dashlane/framework-contracts';
export class TemporarySendMasterPasswordChangedEventCommand extends defineCommand({
    scope: UseCaseScope.User,
}) {
}
