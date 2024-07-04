import { defineCommand, UseCaseScope } from '@dashlane/framework-contracts';
export class FlushLocalDataCommand extends defineCommand({
    scope: UseCaseScope.User,
}) {
}
