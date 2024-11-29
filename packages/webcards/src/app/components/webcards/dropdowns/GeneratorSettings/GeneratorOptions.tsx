import * as React from "react";
import { AutofillDropdownWebcardPasswordGenerationSettings } from "@dashlane/autofill-engine/types";
import { Checkbox, jsx } from "@dashlane/design-system";
import { I18nContext } from "../../../../context/i18n";
import styles from "./GeneratorOptions.module.scss";
interface Props {
  options: AutofillDropdownWebcardPasswordGenerationSettings;
  onOptionsChanged: (
    options: AutofillDropdownWebcardPasswordGenerationSettings
  ) => void;
}
const GeneratorOptionsComponent = ({ options, onOptionsChanged }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const onDigitsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digits = event.currentTarget.checked;
    onOptionsChanged({ ...options, digits });
  };
  const onLettersChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const letters = event.currentTarget.checked;
    onOptionsChanged({ ...options, letters });
  };
  const onSymbolsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const symbols = event.currentTarget.checked;
    onOptionsChanged({ ...options, symbols });
  };
  const onSimilarCharactersChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const similarCharacters = event.currentTarget.checked;
    onOptionsChanged({ ...options, avoidAmbiguous: !similarCharacters });
  };
  const parseExampleLabel = React.useCallback(
    (i18nKey: string) => {
      const translatedLabel = translate(i18nKey);
      const translatedLabelSplit = translatedLabel.split("_");
      if (translatedLabelSplit.length < 3) {
        return translatedLabel;
      }
      return (
        <div>
          {translatedLabelSplit[0]}{" "}
          <span className={styles.monoExample}>{translatedLabelSplit[1]}</span>{" "}
          {translatedLabelSplit[2]}
        </div>
      );
    },
    [translate]
  );
  return (
    <div sx={{ marginTop: "16px" }}>
      <Checkbox
        id="checkbox_use_letters"
        label={parseExampleLabel("generatePasswordOption_letters")}
        onChange={onLettersChanged}
        checked={options.letters}
        className={styles.checkbox}
        disabled={options.letters && !options.digits}
        data-keyboard-accessible={parseExampleLabel(
          "generatePasswordOption_letters"
        )}
      />
      <Checkbox
        id="checkbox_use_digits"
        label={parseExampleLabel("generatePasswordOption_digits")}
        onChange={onDigitsChanged}
        checked={options.digits}
        className={styles.checkbox}
        disabled={options.digits && !options.letters}
        data-keyboard-accessible={parseExampleLabel(
          "generatePasswordOption_digits"
        )}
      />
      <Checkbox
        id="checkbox_use_symbols"
        label={parseExampleLabel("generatePasswordOption_symbols")}
        onChange={onSymbolsChanged}
        checked={options.symbols}
        className={styles.checkbox}
        disabled={options.symbols && !options.letters && !options.digits}
        data-keyboard-accessible={parseExampleLabel(
          "generatePasswordOption_symbols"
        )}
      />
      <Checkbox
        id="checkbox_use_similar_characters"
        label={parseExampleLabel("generatePasswordOption_similarCharacters")}
        onChange={onSimilarCharactersChanged}
        checked={!options.avoidAmbiguous}
        className={styles.checkbox}
        data-keyboard-accessible={parseExampleLabel(
          "generatePasswordOption_similarCharacters"
        )}
      />
    </div>
  );
};
export const GeneratorOptions = React.memo(GeneratorOptionsComponent);
