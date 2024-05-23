import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { Features } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useFeatureFlips } from '@dashlane/framework-react';
import { getExperimentData } from '../experiments/experiment-data';
export const DEBOUNCE_RATE = 200;
interface UseExperimentSearch {
    isSearching: boolean;
    searchValue: string;
    features: {
        status: DataStatus;
        filtered: Record<string, boolean>;
    };
    actions: {
        onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
    };
}
export const useExperimentSearch = (): UseExperimentSearch => {
    const [filteredFeatures, setFilteredFeatures] = useState({});
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const features = useFeatureFlips();
    const cachedFeatures = useMemo(() => (features.status === DataStatus.Success ? features.data : undefined), [features]);
    const search = (rawQuery: string, ff: Features | undefined) => {
        if (ff) {
            const query = rawQuery.trim().toLowerCase();
            const cachedFeaturesFiltered = Object.entries(ff).reduce((filtered, entry) => {
                if (entry[0].toLowerCase().includes(query) ||
                    getExperimentData(entry[0]).name.toLowerCase().includes(query)) {
                    return {
                        ...filtered,
                        [entry[0]]: entry[1],
                    };
                }
                return filtered;
            }, {});
            setFilteredFeatures(cachedFeaturesFiltered);
        }
        setIsSearching(false);
    };
    const debouncedSearch = useRef(debounce((rawQuery, features) => search(rawQuery, features), DEBOUNCE_RATE)).current;
    const onSearchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
        setIsSearching(true);
        debouncedSearch(event.target.value, cachedFeatures);
    };
    useEffect(() => {
        if (cachedFeatures) {
            setFilteredFeatures(cachedFeatures);
        }
    }, [cachedFeatures]);
    return {
        isSearching,
        searchValue,
        features: {
            status: features.status,
            filtered: filteredFeatures,
        },
        actions: {
            onSearch: onSearchChangeHandler,
        },
    };
};
