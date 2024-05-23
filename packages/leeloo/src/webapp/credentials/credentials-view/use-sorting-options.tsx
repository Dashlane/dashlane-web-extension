import { useState } from 'react';
import { CREDENTIALS_LIST_SORTING_OPTIONS } from 'libs/localstorage-constants';
import { OrderDir } from 'libs/sortHelper';
import { SortingOptions } from 'webapp/list-view/types';
export const useSortingOptions = (storageKey = CREDENTIALS_LIST_SORTING_OPTIONS) => {
    const [sortingOptions, setSortingOptions] = useState<SortingOptions>(() => {
        const preferences = localStorage.getItem(storageKey);
        if (preferences) {
            try {
                const storedSortingOptions = JSON.parse(preferences) as SortingOptions;
                return storedSortingOptions;
            }
            catch (_) {
            }
        }
        return {
            field: 'itemName',
            direction: OrderDir.ascending,
        };
    });
    const saveSortingOptionsInStorage = (newSortingOptions: SortingOptions) => localStorage.setItem(storageKey, JSON.stringify(newSortingOptions));
    const setSortOrder = (newSortingOptions: SortingOptions) => {
        setSortingOptions(newSortingOptions);
        saveSortingOptionsInStorage(newSortingOptions);
    };
    return {
        sortingOptions,
        setSortOrder,
    };
};
