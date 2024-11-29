import { useEffect, useRef, useState } from "react";
import Clipboard from "clipboard";
import { Button, Tooltip } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import Row from "../../base-page/row";
import { InputWithCopyButton } from "../../../../libs/dashlane-style/text-input-with-action-button/input-with-copy-button";
import styles from "./styles.css";
const I18N_KEYS = {
  GENERATOR_TITLE: "team_settings_connector_generator_title",
  GENERATOR_DESCRIPTION: "team_settings_connector_generator_description",
  GENERATOR_BUTTON: "team_settings_connector_generator_button",
  GENERATOR_COPY_BUTTON_LABEL:
    "team_settings_connector_generator_copy_button_label",
  GENERATOR_WARNING: "team_settings_connector_generator_warning",
  GENERATOR_ERROR: "team_settings_connector_generator_error",
};
interface GeneratorProps {
  keyValue: string;
  onGenerateClicked: () => void;
  isGeneratorDisabled: boolean;
  generatorDisabledText: string;
}
export const KeyGeneratorDisplay = ({
  keyValue,
  onGenerateClicked,
  isGeneratorDisabled,
  generatorDisabledText,
}: GeneratorProps) => {
  const { translate } = useTranslate();
  const [showKeyWarning, setShowKeyWarning] = useState(false);
  const copyKeyIcon = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (copyKeyIcon.current) {
      new Clipboard(copyKeyIcon.current, {
        text: () => keyValue,
      });
    }
  }, [keyValue]);
  const generateKey = () => {
    setShowKeyWarning(true);
    onGenerateClicked();
  };
  return (
    <Row
      label={translate(I18N_KEYS.GENERATOR_TITLE)}
      labelHelper={translate(I18N_KEYS.GENERATOR_DESCRIPTION)}
    >
      <div className={styles.generatorContainer}>
        <Tooltip
          content={generatorDisabledText}
          passThrough={!isGeneratorDisabled}
          sx={{ maxWidth: "210px" }}
        >
          <div
            className={
              isGeneratorDisabled ? styles.generatorDisableContent : ""
            }
          >
            <Button
              type="button"
              aria-describedby="errorKeyWarning"
              className={styles.generatorButton}
              onClick={generateKey}
              disabled={isGeneratorDisabled}
            >
              {translate(I18N_KEYS.GENERATOR_BUTTON)}
            </Button>
            <div className={styles.generatorInputContainer}>
              <InputWithCopyButton
                inputValue={keyValue}
                textInputProps={{
                  readOnly: true,
                  fullWidth: true,
                  disabled: isGeneratorDisabled,
                  style: {
                    cursor: isGeneratorDisabled ? "not-allowed" : "text",
                  },
                }}
                tooltipProps={{
                  passThrough: isGeneratorDisabled,
                }}
                iconButtonProps={{
                  disabled: isGeneratorDisabled,
                }}
              />
            </div>
            {showKeyWarning && (
              <p id="errorKeyWarning" className={styles.errorText}>
                {translate(I18N_KEYS.GENERATOR_WARNING)}
              </p>
            )}
          </div>
        </Tooltip>
      </div>
    </Row>
  );
};
