import { ChangeEvent, useCallback } from 'react';
import { PasswordGenerationSettings } from '@dashlane/communication';
import { jsx } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Checkbox } from '@dashlane/design-system';
export const I18N_KEYS = {
    OPTIONS_USE_LETTERS: 'webapp_credential_edition_field_generator_use_letters',
    OPTIONS_USE_DIGITS: 'webapp_credential_edition_field_generator_use_digits',
    OPTIONS_USE_SYMBOLS: 'webapp_credential_edition_field_generator_use_symbols',
    OPTIONS_USE_SIMILAR_CHARACTERS: 'webapp_credential_edition_field_generator_similar_characters',
};
export interface GeneratorOptionsProps {
    options: PasswordGenerationSettings;
    onOptionsChanged: (options: PasswordGenerationSettings) => void;
}
export const GeneratorOptions = ({ options, onOptionsChanged, }: GeneratorOptionsProps) => {
    const { translate } = useTranslate();
    const onDigitsChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const digits = event.currentTarget.checked;
        onOptionsChanged({ ...options, digits });
    }, [onOptionsChanged, options]);
    const onLettersChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const letters = event.currentTarget.checked;
        onOptionsChanged({ ...options, letters });
    }, [onOptionsChanged, options]);
    const onSymbolsChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const symbols = event.currentTarget.checked;
        onOptionsChanged({ ...options, symbols });
    }, [onOptionsChanged, options]);
    const onSimilarCharactersChanged = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const similarCharacters = event.currentTarget.checked;
        onOptionsChanged({ ...options, avoidAmbiguous: !similarCharacters });
    }, [onOptionsChanged, options]);
    return (<div sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px',
            marginBottom: '8px',
        }}>
      <div>
        <Checkbox label={translate(I18N_KEYS.OPTIONS_USE_LETTERS)} onChange={onLettersChanged} checked={options.letters} disabled={options.letters && !options.digits}/>
        <Checkbox label={translate(I18N_KEYS.OPTIONS_USE_DIGITS)} onChange={onDigitsChanged} checked={options.digits} disabled={options.digits && !options.letters}/>
      </div>
      <div>
        <Checkbox label={translate(I18N_KEYS.OPTIONS_USE_SYMBOLS)} onChange={onSymbolsChanged} checked={options.symbols}/>
        <Checkbox label={translate(I18N_KEYS.OPTIONS_USE_SIMILAR_CHARACTERS)} onChange={onSimilarCharactersChanged} checked={!options.avoidAmbiguous}/>
      </div>
    </div>);
};
