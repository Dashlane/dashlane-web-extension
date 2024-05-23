import { useState } from 'react';
import { Slider } from '@dashlane/ui-components';
import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    PASSWORD_LENGTH: 'webapp_credential_edition_field_generator_password_length',
    PASSWORD_MIN_MAX: 'webapp_credential_edition_field_generator_min_max_a11y',
};
const sliderMin = 4;
const sliderMax = 40;
interface Props {
    length: number;
    onLengthChanged: (length: number) => void;
}
export const GeneratorSlider = ({ length, onLengthChanged }: Props) => {
    const { translate } = useTranslate();
    const [passwordLength, setPasswordLength] = useState(length);
    const updatePasswordLength = (newLength: number) => {
        setPasswordLength(newLength);
    };
    return (<div aria-label={translate(I18N_KEYS.PASSWORD_MIN_MAX, {
            min: sliderMin,
            max: sliderMax,
        })} sx={{
            '> div': {
                '> label': {
                    color: 'ds.text.neutral.quiet',
                },
                '> p': {
                    color: 'ds.text.neutral.quiet',
                },
            },
        }}>
      <Slider label={translate(I18N_KEYS.PASSWORD_LENGTH, {
            length: passwordLength,
        })} min={sliderMin} max={sliderMax} step={1} onChange={updatePasswordLength} onChangeComplete={onLengthChanged} value={passwordLength}/>
    </div>);
};
