import { useEffect } from "react";
import {
  GeneratePasswordResult,
  PasswordGenerationSettings,
} from "@dashlane/communication";
import { UserGeneratePasswordEvent } from "@dashlane/hermes";
import { carbonConnector } from "../../../libs/carbon/connector";
import { logEvent } from "../../../libs/logs/logEvent";
import { GeneratorSettings } from "./components/generator-settings";
import { ContentCard } from "../../panel/standard/content-card";
export interface GeneratePasswordButtonProps {
  generatorSettings: PasswordGenerationSettings;
  setGeneratorSettings: (settings: PasswordGenerationSettings) => void;
  handleChangePassword: (newPassword: string) => void;
  handleClose: () => void;
}
export const GeneratePasswordCard = ({
  generatorSettings,
  setGeneratorSettings,
  handleChangePassword,
  handleClose,
}: GeneratePasswordButtonProps) => {
  const generateNewPassword = (
    passwordSettings: PasswordGenerationSettings
  ) => {
    carbonConnector
      .generatePassword({ settings: passwordSettings })
      .then((result: GeneratePasswordResult) => {
        if (result.success) {
          handleChangePassword(result.password);
        }
      })
      .finally(() => {
        logEvent(
          new UserGeneratePasswordEvent({
            hasDigits: passwordSettings.digits,
            hasLetters: passwordSettings.letters,
            hasSymbols: passwordSettings.symbols,
            hasSimilar: !passwordSettings.avoidAmbiguous,
            length: passwordSettings.length,
          })
        );
      });
  };
  useEffect(() => {
    generateNewPassword(generatorSettings);
  }, [generatorSettings]);
  const handleRefreshPassword = () => {
    generateNewPassword(generatorSettings);
  };
  const handleSettingsChange = (newSettings: PasswordGenerationSettings) => {
    setGeneratorSettings(newSettings);
    generateNewPassword(newSettings);
  };
  return (
    <ContentCard
      additionalSx={{
        backgroundColor: "ds.container.agnostic.neutral.quiet",
        marginTop: "8px",
      }}
    >
      <GeneratorSettings
        options={generatorSettings}
        handleSettingsChange={handleSettingsChange}
        handleGenerateNewPassword={handleRefreshPassword}
        handleClose={handleClose}
      />
    </ContentCard>
  );
};
