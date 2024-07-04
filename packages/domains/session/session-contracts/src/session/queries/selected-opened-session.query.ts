import { defineQuery, UseCaseScope } from '@dashlane/framework-contracts';
export class SelectedOpenedSessionQuery extends defineQuery<string | undefined>({
    scope: UseCaseScope.Device,
}) {
}
