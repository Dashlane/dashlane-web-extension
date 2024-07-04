import { CommandSuccess, defineCommand, UseCaseScope, } from '@dashlane/framework-contracts';
import { FunctionalError } from '@dashlane/framework-types';
import { UpdateSessionKeyParams } from '../session.types';
export enum ChangeSessionKeyErrorTypes {
    NotCreated = 'notCreated',
    NotOpened = 'notOpened'
}
export class UnableToUpdateSessionKeyForNonExistingAccount extends FunctionalError(ChangeSessionKeyErrorTypes.NotCreated, 'The session has not been created. Create it first.') {
}
export class UnableToUpdateSessionSessionNotOpened extends FunctionalError(ChangeSessionKeyErrorTypes.NotOpened, 'The session has not been opened') {
}
export type UpdateUserSessionKeyErrors = UnableToUpdateSessionKeyForNonExistingAccount | UnableToUpdateSessionSessionNotOpened;
export class UpdateUserSessionKeyCommand extends defineCommand<UpdateSessionKeyParams, CommandSuccess, UpdateUserSessionKeyErrors>({
    scope: UseCaseScope.Device,
}) {
}
