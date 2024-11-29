import { format, setMonth } from "date-fns";
import { Flex, SelectField, SelectOption } from "@dashlane/design-system";
import { createYearsOptions } from "../../../../libs/dashlane-style/date-field/select/services";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  EXPIRY_MONTH: "webapp_field_expiry_date_month",
  EXPIRY_YEAR: "webapp_field_expiry_date_year",
};
const yearsOptions: {
  value: number;
  label: string;
}[] = createYearsOptions([0, 30], "ASC");
const formatMonth = (monthIndex: number) =>
  format(setMonth(new Date(), monthIndex), "MM");
const monthOptions = new Array(12)
  .fill(null)
  .map((_, index) => formatMonth(index));
const monthsSelectOptions = monthOptions.map((monthOption) => (
  <SelectOption key={monthOption} value={monthOption}>
    {monthOption}
  </SelectOption>
));
const yearsSelectOptions = yearsOptions.map((yearsOption) => (
  <SelectOption
    key={yearsOption.value}
    value={JSON.stringify(yearsOption.value)}
  >
    {yearsOption.label}
  </SelectOption>
));
interface ExpiryDatePickerProps {
  month: string;
  year: string;
  disabled?: boolean;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
}
export const ExpiryDatePicker = ({
  month,
  year,
  disabled,
  onYearChange,
  onMonthChange,
}: ExpiryDatePickerProps) => {
  const { translate } = useTranslate();
  return (
    <Flex gap="8px">
      <SelectField
        data-name="card-expiration-month"
        label={translate(I18N_KEYS.EXPIRY_MONTH)}
        value={formatMonth(Number(month) - 1)}
        onChange={(value) => {
          onMonthChange(value);
        }}
        readOnly={disabled}
        sx={{
          flex: 1,
        }}
      >
        {monthsSelectOptions}
      </SelectField>
      <SelectField
        data-name="card-expiration-year"
        label={translate(I18N_KEYS.EXPIRY_YEAR)}
        value={year}
        onChange={(value) => {
          onYearChange(value);
        }}
        readOnly={disabled}
        sx={{ flex: 1 }}
      >
        {yearsSelectOptions}
      </SelectField>
    </Flex>
  );
};
