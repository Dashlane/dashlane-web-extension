import { defineQuery, UseCaseScope } from '@dashlane/framework-contracts';
import { FunctionalError } from '@dashlane/framework-types';
export type UserIsAllowed = {
    isAllowed: true;
};
export enum NotAllowedReason {
    DeviceLimited = 'DeviceLimited',
    Requires2FAEnforcement = 'Requires2FAEnforcement',
    RequiresSSO2MPMigration = 'RequiresSSO2MPMigration',
    RequiresMP2SSOMigration = 'RequiresMP2SSOMigration',
    RequiresSettingUpRecoveryKey = 'RequiresSettingUpRecoveryKey',
    RequiresSettingUpPin = 'RequiresSettingUpPin',
    NoActiveUser = 'NoActiveUser'
}
export type UserIsNotAllowed = {
    isAllowed: false;
    reasons: NotAllowedReason[];
};
export type IsAllowedQueryResult = UserIsAllowed | UserIsNotAllowed;
export class UserNotLogged extends FunctionalError('UserNotLogged', 'Please log the user') {
}
export type IsAllowedQueryFailure = UserNotLogged;
export class IsAllowedQuery extends defineQuery<IsAllowedQueryResult, IsAllowedQueryFailure>({
    scope: UseCaseScope.Device,
}) {
}
