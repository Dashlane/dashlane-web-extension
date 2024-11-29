import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { AvailableLabs } from "@dashlane/framework-contracts";
import { useLabs } from "./use-labs";
export const DEBOUNCE_RATE = 200;
interface UseExperimentSearch {
  isSearching: boolean;
  searchValue: string;
  features: {
    status: DataStatus;
    filtered: AvailableLabs;
  };
  actions: {
    onSearch: (event: ChangeEvent<HTMLInputElement>) => void;
  };
}
export const useExperimentSearch = (): UseExperimentSearch => {
  const [filteredFeatures, setFilteredFeatures] = useState<AvailableLabs>({});
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const labsResponse = useLabs();
  const cachedFeatures = useMemo(
    () =>
      labsResponse.status === DataStatus.Success
        ? labsResponse.labs
        : undefined,
    [labsResponse]
  );
  const search = (rawQuery: string, labs: AvailableLabs | undefined) => {
    if (labs) {
      const query = rawQuery.trim().toLowerCase();
      const cachedFeaturesFiltered = Object.entries(labs).reduce(
        (filtered, [id, lab]) => {
          if (
            lab.featureName.toLowerCase().includes(query) ||
            lab.displayName.toLowerCase().includes(query) ||
            lab.displayDescription.toLowerCase().includes(query)
          ) {
            filtered[id] = lab;
          }
          return filtered;
        },
        {}
      );
      setFilteredFeatures(cachedFeaturesFiltered);
    }
    setIsSearching(false);
  };
  const debouncedSearch = useRef(
    debounce((rawQuery, features) => search(rawQuery, features), DEBOUNCE_RATE)
  ).current;
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
      status: labsResponse.status,
      filtered: filteredFeatures,
    },
    actions: {
      onSearch: onSearchChangeHandler,
    },
  };
};
