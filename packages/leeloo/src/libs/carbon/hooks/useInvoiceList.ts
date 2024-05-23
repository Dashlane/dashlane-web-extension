import { FilterCriterium, GetInvoiceListRequest, Invoice, InvoiceFilterField, OrderDir, } from '@dashlane/communication';
import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
export const useInvoiceList = (tokenQueryParam?: GetInvoiceListRequest): Invoice[] => {
    const filterParams: FilterCriterium<InvoiceFilterField>[] = [];
    if (tokenQueryParam?.currentYearFilter) {
        filterParams.push({
            field: 'startYear',
            value: tokenQueryParam.currentYearFilter,
            type: 'equals',
        });
    }
    if (tokenQueryParam?.currentPlanFilter) {
        filterParams.push({
            field: 'planName',
            value: tokenQueryParam.currentPlanFilter,
            type: 'equals',
        });
    }
    const sortDirection = tokenQueryParam?.sortDirection === OrderDir.ascending
        ? 'ascend'
        : 'descend';
    const queryResult = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getInvoiceList,
            queryParam: {
                filterToken: {
                    filterCriteria: filterParams,
                },
                sortToken: {
                    sortCriteria: [
                        {
                            direction: sortDirection,
                            field: tokenQueryParam?.sortField ?? 'startDate',
                        },
                    ],
                    uniqField: 'invoiceId',
                },
            },
        },
    }, [
        tokenQueryParam?.currentYearFilter,
        tokenQueryParam?.currentPlanFilter,
        tokenQueryParam?.sortDirection,
        tokenQueryParam?.sortField,
    ]);
    if (queryResult.status !== DataStatus.Success || !queryResult?.data?.items) {
        return [];
    }
    return queryResult.data.items;
};
export const useInvoicesCount = (hasListLoaded?: boolean): number => {
    const queryResult = useCarbonEndpoint({ queryConfig: { query: carbonConnector.getInvoicesCount } }, [hasListLoaded]);
    if (queryResult.status !== DataStatus.Success || !queryResult?.data) {
        return 0;
    }
    return queryResult.data;
};
export const useInvoicesListYears = (): string[] => {
    const queryResult = useCarbonEndpoint({ queryConfig: { query: carbonConnector.getInvoiceListYears } }, []);
    if (queryResult.status !== DataStatus.Success || !queryResult?.data) {
        return [];
    }
    return queryResult.data;
};
