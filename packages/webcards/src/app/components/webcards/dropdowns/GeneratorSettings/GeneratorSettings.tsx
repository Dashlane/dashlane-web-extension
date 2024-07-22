import * as React from "react";
import classNames from "classnames";
import { BrowseComponent, PageView } from "@dashlane/hermes";
import { jsx } from "@dashlane/design-system";
import { AutofillDropdownWebcardPasswordGenerationSettings } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { AutofillEngineCommands } from "@dashlane/autofill-engine/dist/autofill-engine/src/client";
import { GeneratorOptions } from "./GeneratorOptions";
import { GeneratorSlider } from "./GeneratorSlider";
import styles from "./GeneratorSettings.module.scss";
interface Props {
  options: AutofillDropdownWebcardPasswordGenerationSettings;
  backgroundColorToken: string;
  handleSettingsChange: (
    newOptions: AutofillDropdownWebcardPasswordGenerationSettings
  ) => void;
  autofillEngineCommands?: AutofillEngineCommands;
}
const DEFAULT_PWD_LENGTH = 16;
const GeneratorSettingsComponent = ({
  options,
  backgroundColorToken,
  handleSettingsChange,
  autofillEngineCommands,
}: Props) => {
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillDropdownPasswordGeneratorSettings,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  const onOptionsChanged = (
    newOptions: AutofillDropdownWebcardPasswordGenerationSettings
  ) => {
    handleSettingsChange(newOptions);
  };
  const onLengthChanged = (length?: number) => {
    if (!length) {
      return;
    }
    handleSettingsChange({ ...options, length });
  };
  return (
    <div
      className={classNames(styles.generatorSettingsWrapper)}
      sx={{ backgroundColor: backgroundColorToken }}
      id="settingsMenu"
    >
      <div className={styles.options}>
        <GeneratorSlider
          length={options.length || DEFAULT_PWD_LENGTH}
          onLengthChanged={onLengthChanged}
        />
        <GeneratorOptions
          onOptionsChanged={onOptionsChanged}
          options={options}
        />
      </div>
    </div>
  );
};
export const GeneratorSettings = React.memo(GeneratorSettingsComponent);
