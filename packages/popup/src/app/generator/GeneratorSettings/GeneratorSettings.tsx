import * as React from 'react';
import classNames from 'classnames';
import { Button, jsx, useToast } from '@dashlane/design-system';
import { PasswordGenerationSettings } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { GeneratorOptions } from 'app/generator/GeneratorSettings/GeneratorOptions';
import { GeneratorSlider } from 'app/generator/GeneratorSettings/GeneratorSlider';
import styles from 'app/generator/GeneratorSettings/GeneratorSettings.css';
const I18N_KEYS = {
    CTA_SAVE_AS_DEFAULT: 'tab/generate/options/cta_save_as_default',
    FEEDBACK_SAVED_AS_DEFAULT: 'tab/generate/options/feedback_saved_as_default',
    ALERT_SAVED_AS_DEFAULT: 'tab/generate/options/alert_saved_as_default',
};
interface Props {
    options: PasswordGenerationSettings;
    savedOptions: PasswordGenerationSettings;
    handleSettingsChange: (options: PasswordGenerationSettings) => void;
    handleSaveNewSettings: (newOptions: PasswordGenerationSettings) => void;
}
const GeneratorSettingsComponent = ({ options, savedOptions, handleSettingsChange, handleSaveNewSettings, }: Props) => {
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const areOptionsDefault = React.useMemo(() => {
        return Object.keys(savedOptions).every((option) => savedOptions[option] === options[option]);
    }, [options, savedOptions]);
    const onOptionsChanged = (newOptions: PasswordGenerationSettings) => {
        handleSettingsChange(newOptions);
    };
    const onLengthChanged = (length?: number) => {
        if (!length) {
            return;
        }
        handleSettingsChange({ ...options, length });
    };
    const saveOptionsAsDefault = React.useCallback(() => {
        handleSaveNewSettings(options);
        showToast({
            description: translate(I18N_KEYS.ALERT_SAVED_AS_DEFAULT),
        });
    }, [options, showToast, translate]);
    return (<div className={classNames(styles.generatorSettingsWrapper)}>
      <div className={styles.options}>
        <GeneratorSlider length={options.length} onLengthChanged={onLengthChanged}/>
        <hr className={styles.optionsSeparator}/>
        <GeneratorOptions onOptionsChanged={onOptionsChanged} options={options}/>
      </div>
      <Button disabled={areOptionsDefault} onClick={saveOptionsAsDefault} mood="neutral" intensity="quiet" size="small" sx={{
            alignSelf: 'flex-end',
        }}>
        {translate(I18N_KEYS.CTA_SAVE_AS_DEFAULT)}
      </Button>
    </div>);
};
export const GeneratorSettings = React.memo(GeneratorSettingsComponent);
