import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { B2BOffers, teamOffersApi } from '@dashlane/team-admin-contracts';
export const useTeamOffers = (): B2BOffers | null => {
    const { data, status } = useModuleQuery(teamOffersApi, 'getTeamOffers', {});
    if (status !== DataStatus.Success) {
        return null;
    }
    return data;
};
