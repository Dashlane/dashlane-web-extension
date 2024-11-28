import * as React from "react";
import { Checkbox, jsx } from "@dashlane/design-system";
import { PasswordGenerationSettings } from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
import { I18N_KEYS } from "./GeneratorOptionsKeys";
import styles from "./GeneratorOptions.css";
export interface GeneratorOptionsProps {
  options: PasswordGenerationSettings;
  onOptionsChanged: (options: PasswordGenerationSettings) => void;
  isReadOnly: boolean;
}
const GeneratorOptionsComponent = ({
  options,
  onOptionsChanged,
  isReadOnly,
}: GeneratorOptionsProps) => {
  const { translate } = useTranslate();
  const onDigitsChanged = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const digits = event.currentTarget.checked;
      onOptionsChanged({ ...options, digits });
    },
    [onOptionsChanged, options]
  );
  const onLettersChanged = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const letters = event.currentTarget.checked;
      onOptionsChanged({ ...options, letters });
    },
    [onOptionsChanged, options]
  );
  const onSymbolsChanged = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const symbols = event.currentTarget.checked;
      onOptionsChanged({ ...options, symbols });
    },
    [onOptionsChanged, options]
  );
  const onSimilarCharactersChanged = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const similarCharacters = event.currentTarget.checked;
      onOptionsChanged({ ...options, avoidAmbiguous: !similarCharacters });
    },
    [onOptionsChanged, options]
  );
  const parseExampleLabel = React.useCallback(
    (i18nKey: string) => {
      const translatedLabel = translate(i18nKey);
      const exampleStartsAt = translatedLabel.search(/(\(.*\))$/);
      if (exampleStartsAt === -1) {
        return translatedLabel;
      }
      const generatorOptionName = translatedLabel.substring(0, exampleStartsAt);
      const generatorOptionExample = translatedLabel.substring(exampleStartsAt);
      return (
        <div>
          {generatorOptionName}
          <span className={styles.optionsExample}>
            {generatorOptionExample}
          </span>
        </div>
      );
    },
    [translate]
  );
  return (
    <>
      <Checkbox
        aria-label={translate(I18N_KEYS.OPTIONS_USE_LETTERS)}
        label={parseExampleLabel(I18N_KEYS.OPTIONS_USE_LETTERS)}
        onChange={onLettersChanged}
        checked={options.letters}
        className={styles.checkbox}
        disabled={options.letters && !options.digits}
        readOnly={isReadOnly}
      />
      <Checkbox
        aria-label={translate(I18N_KEYS.OPTIONS_USE_DIGITS)}
        label={parseExampleLabel(I18N_KEYS.OPTIONS_USE_DIGITS)}
        onChange={onDigitsChanged}
        checked={options.digits}
        className={styles.checkbox}
        disabled={options.digits && !options.letters}
        readOnly={isReadOnly}
      />
      <Checkbox
        aria-label={translate(I18N_KEYS.OPTIONS_USE_SYMBOLS)}
        label={parseExampleLabel(I18N_KEYS.OPTIONS_USE_SYMBOLS)}
        onChange={onSymbolsChanged}
        checked={options.symbols}
        className={styles.checkbox}
        readOnly={isReadOnly}
      />
      <Checkbox
        aria-label={translate(I18N_KEYS.OPTIONS_USE_SIMILAR_CHARACTERS)}
        label={parseExampleLabel(I18N_KEYS.OPTIONS_USE_SIMILAR_CHARACTERS)}
        onChange={onSimilarCharactersChanged}
        checked={!options.avoidAmbiguous}
        className={styles.checkbox}
        readOnly={isReadOnly}
      />
    </>
  );
};
export const GeneratorOptions = React.memo(GeneratorOptionsComponent);
