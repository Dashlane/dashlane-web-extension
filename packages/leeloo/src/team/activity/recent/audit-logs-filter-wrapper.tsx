import { Dispatch, SetStateAction, useState } from "react";
import {
  ActivityLogCategory,
  ActivityLogsQueryFilters,
  ActivityLogType,
} from "@dashlane/risk-monitoring-contracts";
import { ActivityLogsFilterHeader } from "./audit-logs-filter-header";
import { ActivityLogsFilters } from "./audit-logs-filter";
import { DateRange, getDateRangeForPeriod, Period } from "./date-ranges";
interface Props {
  applyFilters: (filters?: ActivityLogsQueryFilters | undefined) => void;
  startDownload: () => void;
  areFiltersLocked: boolean;
  hasError: boolean;
  setDateRange: Dispatch<SetStateAction<DateRange>>;
  sortedTranslatedCategories: {
    category: ActivityLogCategory;
    translatedCategory: string;
  }[];
  initialCategoryFilters?: ActivityLogCategory[];
}
export interface Filters {
  login: string;
  domain: string;
  categories: ActivityLogCategory[];
  logTypes: ActivityLogType[];
}
export const NO_FILTER = "all";
const DEFAULT_FILTERS = {
  login: "",
  domain: "",
  categories: [],
  logTypes: [],
};
const DEFAULT_PERIOD = Period.LAST_WEEK;
export const ActivityLogsFilterWrapper = ({
  applyFilters,
  startDownload,
  areFiltersLocked,
  hasError,
  setDateRange,
  sortedTranslatedCategories,
  initialCategoryFilters = [],
}: Props) => {
  const [canApplyFilters, setCanApplyFilters] = useState(hasError);
  const [canClearFilters, setCanClearFilters] = useState(
    !!initialCategoryFilters.length
  );
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    categories: initialCategoryFilters,
  });
  const [periodFilter, setPeriodFilter] = useState<Period>(DEFAULT_PERIOD);
  const handleChangeFilters = (
    type: keyof ActivityLogsQueryFilters,
    value: string
  ) => {
    setCanApplyFilters(true);
    if (type === "categories" || type === "logTypes") {
      setFilters({
        ...filters,
        [type]: value === NO_FILTER ? DEFAULT_FILTERS[type] : [value],
      });
    } else {
      setFilters({
        ...filters,
        [type]: value,
      });
    }
  };
  const handleChangeDatePeriod = (value: Period) => {
    setPeriodFilter(value);
    setCanApplyFilters(true);
  };
  const handleApplyFilter = () => {
    setDateRange(getDateRangeForPeriod(periodFilter));
    const payload = Object.entries(filters).reduce(
      (acc: undefined | ActivityLogsQueryFilters, [key, value]) => {
        if (value.length) {
          return acc ? { ...acc, [key]: value } : { [key]: value };
        }
        return acc;
      },
      undefined
    );
    applyFilters(payload);
    setCanClearFilters(true);
    setCanApplyFilters(false);
  };
  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setDateRange(getDateRangeForPeriod(DEFAULT_PERIOD));
    setCanClearFilters(false);
    setCanApplyFilters(false);
    applyFilters();
  };
  return (
    <div sx={{ marginBottom: "16px" }}>
      <ActivityLogsFilterHeader
        handleChangeUser={({ target }) =>
          handleChangeFilters("login", target.value)
        }
        userFilter={filters.login}
        startDownload={startDownload}
        areFiltersLocked={areFiltersLocked}
      />

      <ActivityLogsFilters
        areFiltersLocked={areFiltersLocked}
        canApplyFilters={canApplyFilters}
        canClearFilters={canClearFilters}
        filters={filters}
        handleApplyFilter={handleApplyFilter}
        handleChangeDatePeriod={handleChangeDatePeriod}
        handleChangeFilters={handleChangeFilters}
        handleClearFilters={handleClearFilters}
        periodFilter={periodFilter}
        sortedTranslatedCategories={sortedTranslatedCategories}
      />
    </div>
  );
};
