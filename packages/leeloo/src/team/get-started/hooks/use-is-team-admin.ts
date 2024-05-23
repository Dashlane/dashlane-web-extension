import { useState } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useSpaces } from 'libs/carbon/hooks/useSpaces';
export const useIsTeamAdmin = (): {
    isTeamAdmin: boolean | null;
    status: DataStatus;
} => {
    const [isTeamAdmin, setIsTeamAdmin] = useState<boolean | null>(null);
    const spaces = useSpaces();
    if (spaces.status === DataStatus.Success) {
        const result = spaces.data.some((space) => space.isTeamAdmin) ?? false;
        if (result !== isTeamAdmin) {
            setIsTeamAdmin(result);
        }
    }
    return {
        status: spaces.status,
        isTeamAdmin,
    };
};
