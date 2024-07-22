import * as React from "react";
import { Slider } from "@dashlane/ui-components";
import { I18nContext } from "../../../../context/i18n";
interface Props {
  length: number;
  onLengthChanged: (length?: number) => void;
}
const GeneratorSliderComponent = ({ length, onLengthChanged }: Props) => {
  const { translate } = React.useContext(I18nContext);
  const [passwordLength, setPasswordLength] = React.useState(length);
  const updatePasswordLength = (newPasswordLength?: number) => {
    if (newPasswordLength) {
      setPasswordLength(newPasswordLength);
    }
  };
  const sliderLabel = translate("generatePasswordOption_length", {
    0: passwordLength,
  });
  return (
    <Slider
      id="passwordLengthSlider"
      label={sliderLabel}
      min={4}
      max={40}
      step={1}
      onChange={updatePasswordLength}
      onChangeComplete={onLengthChanged}
      value={passwordLength}
      data-keyboard-accessible={sliderLabel}
    />
  );
};
export const GeneratorSlider = React.memo(GeneratorSliderComponent);
