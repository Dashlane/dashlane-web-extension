import { Permission, permissionsApi, UserPermissionsQueryResult, } from '@dashlane/access-rights-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
export interface UsePermissions {
    status: DataStatus;
    getUserPermissions: () => UserPermissionsQueryResult | null;
    hasAnyPermission: (permissions: Permission[]) => boolean;
    hasPermission: (permission: Permission) => boolean;
    hasAllPermissions: (permissions: Permission[]) => boolean;
}
const dataReceived = (status: DataStatus) => {
    return status === DataStatus.Success;
};
const dataIsArray = (data: UserPermissionsQueryResult | undefined): data is Permission[] => Array.isArray(data);
export const usePermissions = (): UsePermissions => {
    const { data, status } = useModuleQuery(permissionsApi, 'userPermissions');
    const getUserPermissions = () => {
        if (!dataReceived(status) || !dataIsArray(data)) {
            return null;
        }
        else {
            return data ?? ([] as UserPermissionsQueryResult);
        }
    };
    const hasPermission = (permission: Permission): boolean => {
        return (dataReceived(status) && dataIsArray(data) && data.includes(permission));
    };
    const hasAnyPermission = (permissions: Permission[]): boolean => {
        return (dataReceived(status) &&
            dataIsArray(data) &&
            permissions.some((permission) => data.includes(permission)));
    };
    const hasAllPermissions = (permissions: Permission[]): boolean => {
        return (dataReceived(status) &&
            dataIsArray(data) &&
            permissions.every((permission) => data.includes(permission)));
    };
    return {
        status,
        getUserPermissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
};
