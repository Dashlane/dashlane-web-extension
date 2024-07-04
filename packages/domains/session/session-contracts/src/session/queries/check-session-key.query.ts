import { defineQuery, UseCaseScope } from '@dashlane/framework-contracts';
import { CheckSessionKeyParams } from '../session.types';
import { CheckSessionKeyErrors } from '../services';
export class CheckSessionKeyQuery extends defineQuery<boolean, CheckSessionKeyErrors, CheckSessionKeyParams>({
    scope: UseCaseScope.Device,
}) {
}
