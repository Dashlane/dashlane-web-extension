import { PasswordGenerationSettings } from "@dashlane/communication";
import { Button } from "@dashlane/design-system";
import { GridContainer } from "@dashlane/ui-components";
import { GeneratorOptions } from "./generator-options";
import { GeneratorSlider } from "./generator-slider";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface GeneratorSettingsProps {
  options: PasswordGenerationSettings;
  handleSettingsChange: (options: PasswordGenerationSettings) => void;
  handleGenerateNewPassword: () => void;
  handleClose: () => void;
}
const I18N_KEYS = {
  GENERATE_ANOTHER_PWD:
    "webapp_credential_edition_button_generate_another_password",
  CLOSE_GENERATOR: "webapp_credential_edition_button_close_password_generator",
};
export const GeneratorSettings = ({
  options,
  handleSettingsChange,
  handleGenerateNewPassword,
  handleClose,
}: GeneratorSettingsProps) => {
  const { translate } = useTranslate();
  const onOptionsChanged = (newOptions: PasswordGenerationSettings) => {
    handleSettingsChange(newOptions);
  };
  const onLengthChanged = (length: number) => {
    handleSettingsChange({ ...options, length });
  };
  return (
    <GridContainer gap="10px" sx={{ padding: "10px" }}>
      <GridContainer
        gap="10px"
        sx={{
          textAlign: "left",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        <GeneratorSlider
          length={options.length}
          onLengthChanged={onLengthChanged}
        />
        <GeneratorOptions
          onOptionsChanged={onOptionsChanged}
          options={options}
        />
      </GridContainer>

      <Button
        fullsize
        mood="brand"
        intensity="catchy"
        onClick={handleGenerateNewPassword}
      >
        {translate(I18N_KEYS.GENERATE_ANOTHER_PWD)}
      </Button>
      <Button fullsize mood="neutral" intensity="quiet" onClick={handleClose}>
        {translate(I18N_KEYS.CLOSE_GENERATOR)}
      </Button>
    </GridContainer>
  );
};
