import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { CallingCodes } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const useAllCallingCodes = (): CallingCodes => {
    const result = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getAllCallingCodes,
        },
    }, []);
    return result.status === DataStatus.Success ? result.data : {};
};
export const useAllCallingCodesSelectOptions = () => {
    const callingCodes = useAllCallingCodes();
    return Object.keys(callingCodes).map((key) => {
        return { label: `${key} (+${callingCodes[key]})`, value: key };
    });
};
