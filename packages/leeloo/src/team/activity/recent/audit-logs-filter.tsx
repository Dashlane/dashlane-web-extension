import {
  Button,
  Flex,
  Paragraph,
  SelectField,
  SelectOption,
  TextField,
} from "@dashlane/design-system";
import {
  ActivityLogCategory,
  ActivityLogsQueryFilters,
} from "@dashlane/risk-monitoring-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Period } from "./date-ranges";
import { supportedTypes } from "./audit-logs/getAuditLogActivityDescription";
import { type Filters, NO_FILTER } from "./audit-logs-filter-wrapper";
const I18N_KEYS = {
  FILTERS_ACTION_APPLY: "team_activity_filters_action_apply",
  FILTERS_ACTION_CLEAR: "team_activity_filters_action_clear",
  FILTERS_LABEL_CATEGORY: "team_activity_filters_label_category",
  FILTERS_LABEL_DOMAIN: "team_activity_filters_label_domain",
  FILTERS_LABEL_DATE: "team_activity_filters_label_date",
  FILTERS_LABEL_TYPE: "team_activity_filters_label_type",
  FILTERS_SUBTITLE: "team_activity_filters_subtitle",
  FILTERS_ALL_CATEGORIES: "team_activity_filters_all_categories",
  FILTERS_ALL_LOG_TYPES: "team_activity_filters_all_log_types",
};
interface Props {
  areFiltersLocked: boolean;
  canApplyFilters: boolean;
  canClearFilters: boolean;
  filters: Filters;
  handleChangeFilters: (
    type: keyof ActivityLogsQueryFilters,
    value: string
  ) => void;
  handleApplyFilter: () => void;
  handleChangeDatePeriod: (value: Period) => void;
  handleClearFilters: () => void;
  periodFilter: string;
  sortedTranslatedCategories: {
    category: ActivityLogCategory;
    translatedCategory: string;
  }[];
}
export const ActivityLogsFilters = ({
  areFiltersLocked,
  canApplyFilters,
  canClearFilters,
  filters,
  handleApplyFilter,
  handleChangeDatePeriod,
  handleChangeFilters,
  handleClearFilters,
  periodFilter,
  sortedTranslatedCategories,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "ds.container.agnostic.neutral.quiet",
        borderRadius: "8px",
        padding: "24px",
        gap: "16px",
      }}
    >
      <Paragraph textStyle="ds.title.supporting.small">
        {translate(I18N_KEYS.FILTERS_SUBTITLE)}
      </Paragraph>
      <div
        sx={{
          display: "grid",
          gap: "24px",
          justifyContent: "space-between",
          gridTemplateColumns: "repeat(4, calc(25% - 20px))",
        }}
      >
        <TextField
          label={translate(I18N_KEYS.FILTERS_LABEL_DOMAIN)}
          disabled={areFiltersLocked}
          onChange={({ target }) => handleChangeFilters("domain", target.value)}
          value={filters.domain}
        />

        <SelectField
          label={translate(I18N_KEYS.FILTERS_LABEL_CATEGORY)}
          disabled={areFiltersLocked}
          onChange={(value) => handleChangeFilters("categories", value)}
          value={filters.categories[0] ?? NO_FILTER}
        >
          <SelectOption value={NO_FILTER} key="select_option_default_category">
            {translate(I18N_KEYS.FILTERS_ALL_CATEGORIES)}
          </SelectOption>
          {sortedTranslatedCategories.map(
            ({ category, translatedCategory }) => (
              <SelectOption value={category} key={`select_option_${category}`}>
                {translatedCategory}
              </SelectOption>
            )
          )}
        </SelectField>

        <SelectField
          label={translate(I18N_KEYS.FILTERS_LABEL_TYPE)}
          disabled={areFiltersLocked}
          onChange={(value) => handleChangeFilters("logTypes", value)}
          value={filters.logTypes[0] ?? NO_FILTER}
        >
          <SelectOption value={NO_FILTER} key="select_option_default_log_type">
            {translate(I18N_KEYS.FILTERS_ALL_LOG_TYPES)}
          </SelectOption>
          {supportedTypes.map((type) => (
            <SelectOption value={type} key={`select_option_${type}`}>
              {`team_audit_log_activity_${type}`}
            </SelectOption>
          ))}
        </SelectField>

        <SelectField
          label={translate(I18N_KEYS.FILTERS_LABEL_DATE)}
          disabled={areFiltersLocked}
          onChange={handleChangeDatePeriod}
          value={periodFilter}
        >
          {Object.values(Period).map((period) => (
            <SelectOption value={period} key={`select_option_${period}`}>
              {translate(`team_audit_log_date_range_${period}`)}
            </SelectOption>
          ))}
        </SelectField>
      </div>
      <Flex flexDirection="row" gap="8px">
        <Button
          mood="brand"
          onClick={handleApplyFilter}
          disabled={areFiltersLocked || !canApplyFilters}
        >
          {translate(I18N_KEYS.FILTERS_ACTION_APPLY)}
        </Button>
        <Button
          mood="neutral"
          intensity="quiet"
          layout="labelOnly"
          onClick={handleClearFilters}
          disabled={areFiltersLocked || !canClearFilters}
        >
          {translate(I18N_KEYS.FILTERS_ACTION_CLEAR)}
        </Button>
      </Flex>
    </div>
  );
};
