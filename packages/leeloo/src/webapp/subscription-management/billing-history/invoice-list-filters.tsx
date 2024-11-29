import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTriggerButton,
} from "@dashlane/design-system";
import { useInvoicesListYears } from "../../../libs/carbon/hooks/useInvoiceList";
import useTranslate from "../../../libs/i18n/useTranslate";
export type PlanFilters =
  | "ADVANCED"
  | "ESSENTIALS"
  | "FAMILY"
  | "PREMIUM"
  | "OTHER"
  | "";
export interface InvoiceListFiltersProps {
  changePlanFilter: (planFilter: PlanFilters) => void;
  changeYearFilter: (year: string) => void;
  currentPlanFilter: PlanFilters;
  currentYearFilter: string;
}
const I18N_KEYS = {
  ALL_YEARS_FILTER: "manage_subscription_billing_section_filter_years",
  ALL_PLANS_FILTER: "manage_subscription_billing_section_filter_all_plans",
  PLAN_NAME_ADVANCED: "manage_subscription_plan_name_advanced",
  PLAN_NAME_ESSENTIALS: "manage_subscription_plan_name_essentials",
  PLAN_NAME_FAMILY: "manage_subscription_plan_name_family",
  PLAN_NAME_PREMIUM: "manage_subscription_plan_name_premium",
  PLAN_NAME_OTHER: "manage_subscription_billing_section_filter_plans_others",
};
export const InvoiceListFilters = ({
  changePlanFilter,
  changeYearFilter,
  currentPlanFilter,
  currentYearFilter,
}: InvoiceListFiltersProps) => {
  const { translate } = useTranslate();
  const yearList = useInvoicesListYears();
  const currentYear = (new Date().getFullYear() - 1).toString();
  if (!yearList.includes(currentYear)) {
    yearList.push(currentYear);
  }
  const planNameString = currentPlanFilter
    ? I18N_KEYS[`PLAN_NAME_${currentPlanFilter}`]
    : I18N_KEYS.ALL_PLANS_FILTER;
  const planFilterList: PlanFilters[] = [
    "ADVANCED",
    "ESSENTIALS",
    "PREMIUM",
    "FAMILY",
    "OTHER",
  ];
  return (
    <div sx={{ display: "flex", gap: "10px" }}>
      <DropdownMenu>
        <DropdownTriggerButton showCaret>
          {currentYearFilter
            ? currentYearFilter
            : translate(I18N_KEYS.ALL_YEARS_FILTER)}
        </DropdownTriggerButton>
        <DropdownContent>
          <DropdownItem
            label={translate(I18N_KEYS.ALL_YEARS_FILTER)}
            key={`yearFilter-all`}
            onSelect={() => changeYearFilter("")}
          />
          {yearList.map((year: string) => (
            <DropdownItem
              onSelect={() => changeYearFilter(year)}
              key={`yearFilter-${year}`}
              label={year}
            />
          ))}
        </DropdownContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownTriggerButton showCaret>
          {translate(planNameString)}
        </DropdownTriggerButton>
        <DropdownContent>
          <DropdownItem
            label={translate(I18N_KEYS.ALL_PLANS_FILTER)}
            key={`planFilter-all`}
            onSelect={() => changePlanFilter("")}
          />
          {planFilterList.map((filter) => (
            <DropdownItem
              label={translate(I18N_KEYS[`PLAN_NAME_${filter}`])}
              key={`planFilter-${filter}`}
              onSelect={() => changePlanFilter(filter)}
            />
          ))}
        </DropdownContent>
      </DropdownMenu>
    </div>
  );
};
