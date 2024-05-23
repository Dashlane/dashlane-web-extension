import { PasswordGenerationSettings } from '@dashlane/communication';
import { UserGeneratePasswordEvent } from '@dashlane/hermes';
import * as React from 'react';
import { GeneratorSettings } from 'app/generator/GeneratorSettings/GeneratorSettings';
import { generatePassword, savePasswordGenerationSettings } from 'libs/api';
import { logEvent } from 'libs/logs/logEvent';
import { GeneratedPassword } from 'src/app/generator/generated-password/generated-password';
import useTranslate from 'src/libs/i18n/useTranslate';
import { getRandomPassword } from './generated-password/passwordShuffler/helpers';
import styles from './styles.css';
export interface GeneratorProps {
    savedOptions: PasswordGenerationSettings;
    onSaveGeneratorOptions: (options: PasswordGenerationSettings) => void;
}
const I18N_KEYS = {
    HEADER: 'tab/generate/password_generator',
};
const GeneratorComponent = ({ savedOptions, onSaveGeneratorOptions, }: GeneratorProps) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [options, setNewOptions] = React.useState(savedOptions);
    const [generatedPassword, setGeneratedPassword] = React.useState(getRandomPassword(savedOptions.length));
    const [generatedPasswordStrength, setGeneratedPasswordStrength] = React.useState(25);
    const generateNewPassword = (settings: PasswordGenerationSettings) => {
        setIsLoading(true);
        void logEvent(new UserGeneratePasswordEvent({
            hasLetters: settings.letters,
            hasDigits: settings.digits,
            hasSymbols: settings.symbols,
            hasSimilar: !settings.avoidAmbiguous,
            length: settings.length,
        }));
        void generatePassword(settings).then((result) => {
            if (result.success) {
                setGeneratedPassword(result.password);
                setGeneratedPasswordStrength(result.strength);
            }
        });
    };
    React.useEffect(() => {
        generateNewPassword(options);
    }, [options]);
    React.useEffect(() => {
        setIsLoading(false);
    }, [generatedPassword]);
    const handleRefreshPassword = () => {
        generateNewPassword(options);
    };
    const handleSettingsChange = (newOptions: PasswordGenerationSettings) => {
        generateNewPassword(newOptions);
        setNewOptions(newOptions);
    };
    const handleSaveNewSettings = (newOptions: PasswordGenerationSettings) => {
        savePasswordGenerationSettings(newOptions);
        onSaveGeneratorOptions(newOptions);
    };
    const { translate } = useTranslate();
    return (<div className={styles.column}>
      <h1 aria-label={translate(I18N_KEYS.HEADER)} tabIndex={-1}/>
      <GeneratedPassword onRefreshPassword={handleRefreshPassword} isLoading={isLoading} passwordLength={options.length} generatedPassword={generatedPassword} strength={generatedPasswordStrength}/>
      <GeneratorSettings options={options} savedOptions={savedOptions} handleSettingsChange={handleSettingsChange} handleSaveNewSettings={handleSaveNewSettings}/>
    </div>);
};
export const Generator = React.memo(GeneratorComponent);
