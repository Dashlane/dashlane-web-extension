import { GlobalState } from 'store/types';
import { AdminPermissionLevel, groupPermissions, } from '@dashlane/communication';
export interface Permissions {
    tacAccessPermissions: Set<AdminPermissionLevel>;
}
export interface AdminAccess {
    hasTACAccess: boolean;
    hasFullAccess: boolean;
    hasBillingAccess: boolean;
    hasGroupAccess: boolean;
    hasPermissionLevel: (p: AdminPermissionLevel) => boolean;
}
export interface PermissionChecker {
    loggedIn: boolean;
    adminAccess: AdminAccess;
}
export function makePermissionChecker(globalState: GlobalState): PermissionChecker {
    const state = globalState.user.session.permissions;
    const loggedIn = Boolean(globalState.carbon.loginStatus && globalState.carbon.loginStatus.loggedIn);
    const hasFullAccess = state.tacAccessPermissions.has('FULL');
    const hasBillingAccess = state.tacAccessPermissions.has('BILLING');
    const hasGroupAccess = Array.from(state.tacAccessPermissions).some((p) => groupPermissions.includes(p));
    const hasPermissionLevel = (permissionLevel: AdminPermissionLevel) => {
        return state.tacAccessPermissions.has(permissionLevel);
    };
    return {
        loggedIn,
        adminAccess: {
            hasTACAccess: hasFullAccess || hasBillingAccess || hasGroupAccess,
            hasFullAccess,
            hasBillingAccess,
            hasGroupAccess,
            hasPermissionLevel,
        },
    };
}
