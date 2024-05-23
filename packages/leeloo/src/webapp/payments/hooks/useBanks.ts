import React from 'react';
import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { Banks } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const EMPTY_BANKS = {};
export const areBanksReady = (banks: Banks): boolean => banks !== EMPTY_BANKS;
export const useBanks = (): Banks => {
    const allBanksRef = React.useRef<Banks>(EMPTY_BANKS);
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getAllBanks,
        },
    }, []);
    if (!areBanksReady(allBanksRef.current) &&
        result.status === DataStatus.Success) {
        allBanksRef.current = result.data;
    }
    return allBanksRef.current;
};
