import * as React from 'react';
import { Slider } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    PASSWORD_LENGTH: 'tab/generate/password_length',
    PASSWORD_LENGTH_TITLE: 'tab/generate/password_length_title',
};
interface Props {
    length: number;
    onLengthChanged: (length?: number) => void;
}
const GeneratorSliderComponent = ({ length, onLengthChanged }: Props) => {
    const { translate } = useTranslate();
    const [passwordLength, setPasswordLength] = React.useState(length);
    const updatePasswordLength = React.useCallback((length?: number) => {
        if (length) {
            setPasswordLength(length);
        }
    }, []);
    return (<div aria-valuemin={4} aria-valuemax={40} aria-valuenow={passwordLength} aria-valuetext={translate(I18N_KEYS.PASSWORD_LENGTH, {
            length: passwordLength,
        })} role="slider" aria-live="assertive">
      <Slider id="passwordLengthString" aria-label={translate(I18N_KEYS.PASSWORD_LENGTH_TITLE)} label={translate(I18N_KEYS.PASSWORD_LENGTH, {
            length: passwordLength,
        })} min={4} max={40} step={1} onChange={updatePasswordLength} onChangeComplete={onLengthChanged} value={passwordLength}/>
    </div>);
};
export const GeneratorSlider = React.memo(GeneratorSliderComponent);
