import * as React from 'react';
import { useFormikContext } from 'formik';
import { BaseIdUpdateModel } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { useCountryStates } from 'webapp/ids/hooks/use-static-states';
import { CountryField } from './CountryField';
import { getDefaultOption, SelectField } from './SelectField';
interface Props {
    countryFieldLabel: string;
    stateFieldLabel: string;
    disabled?: boolean;
    handleError: (error: Error) => void;
}
const COUNTRY_FIELD_NAME = 'country';
const STATE_FIELD_NAME = 'state';
const CountryAndStateFieldComponent = (props: Props) => {
    const { translate } = useTranslate();
    const { initialValues, setFieldValue, values } = useFormikContext<BaseIdUpdateModel>();
    const initialValue = initialValues[STATE_FIELD_NAME];
    const currentValue = values[STATE_FIELD_NAME];
    const initialCountry = initialValues[COUNTRY_FIELD_NAME];
    const currentCountry = values[COUNTRY_FIELD_NAME];
    const countryChanged = initialCountry !== currentCountry;
    const stateOptions = useCountryStates(currentCountry, props.handleError);
    const { current: defaultOption } = React.useRef(getDefaultOption(translate));
    const options = React.useMemo(() => (stateOptions ? [defaultOption, ...stateOptions] : undefined), [stateOptions, defaultOption]);
    const currentOption = options?.find(({ value }) => value === currentValue) ??
        (currentValue
            ?
                { label: currentValue, value: currentValue }
            : defaultOption);
    React.useEffect(() => {
        setFieldValue('state', countryChanged ? defaultOption.value : initialValue);
    }, [countryChanged, defaultOption.value, initialValue, setFieldValue]);
    return (<>
      <CountryField name={COUNTRY_FIELD_NAME} label={props.countryFieldLabel} disabled={props.disabled}/>
      {defaultOption && options ? (<SelectField key={currentCountry} name={STATE_FIELD_NAME} label={props.stateFieldLabel} options={options} defaultOption={currentOption} placeholder={defaultOption.label} disabled={props.disabled}/>) : null}
    </>);
};
export const CountryAndStateField = React.memo(CountryAndStateFieldComponent);
