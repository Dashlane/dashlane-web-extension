import { ArrowDownIcon, Button, DropdownElement, DropdownMenu, jsx, } from '@dashlane/ui-components';
import { useInvoicesListYears } from 'libs/carbon/hooks/useInvoiceList';
import useTranslate from 'libs/i18n/useTranslate';
export type PlanFilters = 'ADVANCED' | 'ESSENTIALS' | 'FAMILY' | 'PREMIUM' | 'OTHER' | '';
export interface InvoiceListFiltersProps {
    changePlanFilter: (planFilter: PlanFilters) => void;
    changeYearFilter: (year: string) => void;
    currentPlanFilter: PlanFilters;
    currentYearFilter: string;
}
const I18N_KEYS = {
    ALL_YEARS_FILTER: 'manage_subscription_billing_section_filter_years',
    ALL_PLANS_FILTER: 'manage_subscription_billing_section_filter_all_plans',
    PLAN_NAME_ADVANCED: 'manage_subscription_plan_name_advanced',
    PLAN_NAME_ESSENTIALS: 'manage_subscription_plan_name_essentials',
    PLAN_NAME_FAMILY: 'manage_subscription_plan_name_family',
    PLAN_NAME_PREMIUM: 'manage_subscription_plan_name_premium',
    PLAN_NAME_OTHER: 'manage_subscription_billing_section_filter_plans_others',
};
export const InvoiceListFilters = ({ changePlanFilter, changeYearFilter, currentPlanFilter, currentYearFilter, }: InvoiceListFiltersProps) => {
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
        'ADVANCED',
        'ESSENTIALS',
        'PREMIUM',
        'FAMILY',
        'OTHER',
    ];
    return (<div sx={{ marginTop: '32px' }}>
      <DropdownMenu placement="bottom-start" sx={{ width: '140px' }} content={[
            <DropdownElement fullWidth key={`yearFilter-all`} onClick={() => changeYearFilter('')}>
            {translate(I18N_KEYS.ALL_YEARS_FILTER)}
          </DropdownElement>,
            ...yearList.map((year: string) => (<DropdownElement fullWidth key={`yearFilter-${year}`} onClick={() => changeYearFilter(year)}>
              {year}
            </DropdownElement>)),
        ]}>
        <Button type="button" nature="secondary" sx={{ mr: '8px' }}>
          {currentYearFilter
            ? currentYearFilter
            : translate(I18N_KEYS.ALL_YEARS_FILTER)}
          <ArrowDownIcon sx={{ ml: '12px' }}/>
        </Button>
      </DropdownMenu>

      <DropdownMenu placement="bottom-start" sx={{ width: '140px' }} content={[
            <DropdownElement fullWidth key={`planFilter-all`} onClick={() => changePlanFilter('')}>
            {translate(I18N_KEYS.ALL_PLANS_FILTER)}
          </DropdownElement>,
            ...planFilterList.map((filter) => (<DropdownElement fullWidth key={`planFilter-${filter}`} onClick={() => changePlanFilter(filter)}>
              {translate(I18N_KEYS[`PLAN_NAME_${filter}`])}
            </DropdownElement>)),
        ]}>
        <Button type="button" nature="secondary">
          {translate(planNameString)}
          <ArrowDownIcon sx={{ ml: '12px' }}/>
        </Button>
      </DropdownMenu>
    </div>);
};
