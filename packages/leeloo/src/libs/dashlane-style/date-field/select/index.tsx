import * as React from 'react';
import { format as dateFormatter, getDaysInMonth, parse, setDate, setMonth, setYear, } from 'date-fns';
import useTranslate from 'libs/i18n/useTranslate';
import DetailSelect, { Option as DetailSelectOption, } from 'libs/dashlane-style/select-field/detail';
import { createDaysOptions, createMonthsOptions, createYearsOptions, } from './services';
import { FlexContainer } from '@dashlane/ui-components';
interface Props {
    value: string;
    label: string;
    dateFormat: string;
    yearsRange?: [
        number,
        number
    ];
    sortYears?: 'ASC' | 'DESC';
    monthLabelFormatter: (timestamp: Date) => string;
    onChange: (newValue: string) => void;
    hideDay?: boolean;
    allowEmpty?: boolean;
    locale?: string;
    disabled?: boolean;
}
const parseDate = (value: string, dateFormat: string): Date => parse(value, dateFormat, new Date('1900-01-01'));
const getDefaultDate = (): Date => {
    const defaultDate = new Date();
    defaultDate.setUTCHours(0, 0, 0, 0);
    return defaultDate;
};
const handleFieldChange = (value: string, dateFormat: string, onChange: (newValue: string) => void) => (setFieldHandler: (d: Date, newValue: number) => Date) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === '') {
        onChange('');
        return;
    }
    const newValue = parseInt(event.target.value, 10);
    const parsedCurrentValue = parseDate(value, dateFormat);
    const currentValueValid = !isNaN(parsedCurrentValue.getTime());
    const currentDate = currentValueValid
        ? parsedCurrentValue
        : getDefaultDate();
    onChange(dateFormatter(setFieldHandler(currentDate, newValue), dateFormat));
};
const getCurrentOption = (options: {
    label: string;
    value: number | string;
}[], value: number | string) => options.find(({ value: optionValue }) => value === optionValue) ?? options[0];
const I18N_KEYS = {
    DAY: 'webapp_id_form_field_placeholder_day',
    MONTH: 'webapp_id_form_field_placeholder_month',
    YEAR: 'webapp_id_form_field_placeholder_year',
};
const getEmptyOption = (label: string) => {
    return { label, value: '' };
};
type Option = {
    label: string;
    value: number | string;
};
export const DateFieldSelect = ({ yearsRange = [-120, 0], sortYears = 'ASC', hideDay = false, value, label, dateFormat, monthLabelFormatter, onChange, allowEmpty = false, locale = undefined, disabled = false, }: Props) => {
    const { translate } = useTranslate();
    const yearsOptions: Option[] = createYearsOptions(yearsRange, sortYears);
    const monthsOptions: Option[] = createMonthsOptions((timestamp) => monthLabelFormatter(timestamp));
    const handleChangeDateGenerator = handleFieldChange(value, dateFormat, onChange);
    const handleDateChange = handleChangeDateGenerator(setDate);
    const handleYearChange = handleChangeDateGenerator(setYear);
    const handleMonthChange = handleChangeDateGenerator(setMonth);
    const parsedDate = parseDate(value, dateFormat);
    const daysOptions: Option[] = createDaysOptions(getDaysInMonth(value === '' ? 31 : parsedDate));
    if (allowEmpty) {
        yearsOptions.unshift(getEmptyOption(translate(I18N_KEYS.YEAR)));
        monthsOptions.unshift(getEmptyOption(translate(I18N_KEYS.MONTH)));
        daysOptions.unshift(getEmptyOption(translate(I18N_KEYS.DAY)));
    }
    const currentYearOption: DetailSelectOption = getCurrentOption(yearsOptions, parsedDate.getFullYear());
    const currentMonthOption: DetailSelectOption = getCurrentOption(monthsOptions, parsedDate.getMonth());
    const currentDayOption: DetailSelectOption = getCurrentOption(daysOptions, parsedDate.getDate());
    const dateLocale = locale
        ? locale
        : new Intl.NumberFormat().resolvedOptions().locale;
    const testDate = new Date(Date.UTC(2013, 11, 21));
    const nonDigitsCleanerRegexp = /\D/g;
    const testDay = testDate
        .toLocaleDateString(dateLocale, { day: 'numeric' })
        .replace(nonDigitsCleanerRegexp, '');
    const testMonth = testDate
        .toLocaleDateString(dateLocale, { month: 'numeric' })
        .replace(nonDigitsCleanerRegexp, '');
    const testYear = testDate
        .toLocaleDateString(dateLocale, { year: 'numeric' })
        .replace(nonDigitsCleanerRegexp, '');
    const testFull = testDate.toLocaleDateString(dateLocale, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const separatorMatch = testFull.match(/[.\-/]/);
    let orderArray = ['month', 'day', 'year'];
    if (separatorMatch) {
        const valuesArray = testFull
            .replace(/[\u200E\u200F]/g, '')
            .split(separatorMatch[0]);
        if (valuesArray.length >= 3) {
            const tmpOrderArray = valuesArray.reduce((aAcc, aValue) => {
                switch (aValue.replace(nonDigitsCleanerRegexp, '')) {
                    case testDay:
                        if (!hideDay) {
                            aAcc.push('day');
                        }
                        break;
                    case testMonth:
                        aAcc.push('month');
                        break;
                    case testYear:
                        aAcc.push('year');
                        break;
                    default:
                        break;
                }
                return aAcc;
            }, [] as string[]);
            if (tmpOrderArray.length === 3 ||
                (hideDay && tmpOrderArray.length === 2)) {
                orderArray = tmpOrderArray;
            }
        }
    }
    return (<FlexContainer alignItems="center">
      {orderArray.map((aValue, aIndex) => {
            switch (aValue) {
                case 'day':
                    if (!hideDay) {
                        return (<DetailSelect key={`day-${value}`} label={aIndex ? '' : label} ariaLabel={`${label} :${translate(I18N_KEYS.DAY)}`} placeholder={currentDayOption.label} dataName="dateDay" options={daysOptions} defaultOption={currentDayOption} onChange={handleDateChange} disabled={disabled}/>);
                    }
                    return '';
                case 'month':
                    return (<DetailSelect key={`month-${value}`} label={aIndex ? '' : label} ariaLabel={`${label} :${translate(I18N_KEYS.MONTH)}`} placeholder={currentMonthOption.label} dataName="dateMonth" options={monthsOptions} defaultOption={currentMonthOption} onChange={handleMonthChange} disabled={disabled}/>);
                case 'year':
                    return (<DetailSelect key={`year-${value}`} label={aIndex ? '' : label} ariaLabel={`${label} :${translate(I18N_KEYS.YEAR)}`} placeholder={currentYearOption.label} dataName="dateYear" options={yearsOptions} defaultOption={currentYearOption} onChange={handleYearChange} disabled={disabled}/>);
                default:
                    return '';
            }
        })}
    </FlexContainer>);
};
