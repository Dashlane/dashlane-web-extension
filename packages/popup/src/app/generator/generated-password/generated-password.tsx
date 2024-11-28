import * as React from "react";
import classNames from "classnames";
import { jsx, PasswordStrength, useToast } from "@dashlane/design-system";
import { GeneratedPasswordItemView } from "@dashlane/communication";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { useHasFeatureEnabled } from "../../../libs/hooks/useHasFeature";
import useTranslate from "../../../libs/i18n/useTranslate";
import { getZxcvbnScoreFrom100BaseStrength } from "../strength";
import { GeneratedPasswordField } from "./generated-password-field";
import { GeneratedPasswordActions } from "./actions/generated-password-actions";
import { usePasswordShuffler } from "./passwordShuffler/usePasswordShuffler";
import {
  getGeneratedPasswordsList,
  saveGeneratedPassword,
} from "../../../libs/api/passwordGeneration/passwordGeneration";
import styles from "./generated-password.css";
const BUTTON_DISABLING_DELAY = 1500;
const I18N_KEYS = {
  PASSWORD_COPIED_TO_CLIPBOARD: "tab/generate/password_copied_to_clipboard",
  PASSWORD_STRENGTH: {
    TOO_GUESSABLE: "tab/generate/password_strength/too_guessable",
    VERY_GUESSABLE: "tab/generate/password_strength/very_guessable",
    SOMEWHAT_GUESSABLE: "tab/generate/password_strength/somewhat_guessable",
    SAFELY_UNGUESSABLE: "tab/generate/password_strength/safely_unguessable",
    VERY_UNGUESSABLE: "tab/generate/password_strength/very_unguessable",
    NONE: "tab/generate/password_strength/none",
  },
};
interface Props {
  isLoading: boolean;
  generatedPassword: string;
  passwordLength: number;
  strength: number;
  onRefreshPassword: () => void;
  isDisabled: boolean;
}
const GeneratedPasswordComponent = ({
  isLoading,
  generatedPassword,
  passwordLength,
  onRefreshPassword,
  strength,
  isDisabled,
}: Props) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const [isPasswordCopied, setIsPasswordCopied] = React.useState(false);
  const [generatedPasswordsList, updateGeneratedPasswordsLists] =
    React.useState<GeneratedPasswordItemView[]>([]);
  const prideColorsEnabled = useHasFeatureEnabled(
    FEATURE_FLIPS_WITHOUT_MODULE.WebplatformWebPrideColors
  );
  const zxcvbnScore = React.useMemo(
    () => getZxcvbnScoreFrom100BaseStrength(strength),
    [strength]
  );
  const { shuffledPassword, isPasswordShuffling } = usePasswordShuffler({
    shouldShuffle: isLoading,
    passwordLength,
  });
  const password = isPasswordShuffling ? shuffledPassword : generatedPassword;
  React.useEffect(() => {
    void getGeneratedPasswordsList().then((list) => {
      updateGeneratedPasswordsLists(list.items);
    });
  }, []);
  React.useEffect(() => {
    if (isLoading && isPasswordCopied) {
      setIsPasswordCopied(false);
    }
  }, [isLoading, isPasswordCopied]);
  const onCopyPassword = React.useCallback(async () => {
    await navigator.clipboard.writeText(generatedPassword);
    setIsPasswordCopied(true);
    await saveGeneratedPassword(generatedPassword);
    const list = await getGeneratedPasswordsList();
    updateGeneratedPasswordsLists(list.items);
    showToast({
      description: translate(I18N_KEYS.PASSWORD_COPIED_TO_CLIPBOARD),
    });
    setTimeout(() => {
      setIsPasswordCopied(false);
    }, BUTTON_DISABLING_DELAY);
  }, [generatedPassword, showToast, translate]);
  return (
    <div
      className={classNames(styles.generatedPasswordContainer)}
      sx={{
        backgroundColor: "ds.container.agnostic.neutral.standard",
      }}
    >
      <div className={styles.passwordAndIndicator}>
        <GeneratedPasswordField
          onRefreshPassword={onRefreshPassword}
          password={password}
          isDisabled={isDisabled}
        />
        <div className={styles.indicator}>
          <PasswordStrength
            score={zxcvbnScore}
            descriptionId="generator-password-strength"
            description={{
              TooGuessable: translate(
                I18N_KEYS.PASSWORD_STRENGTH.TOO_GUESSABLE
              ),
              VeryGuessable: translate(
                I18N_KEYS.PASSWORD_STRENGTH.VERY_GUESSABLE
              ),
              SomewhatGuessable: translate(
                I18N_KEYS.PASSWORD_STRENGTH.SOMEWHAT_GUESSABLE
              ),
              SafelyUnGuessable: translate(
                I18N_KEYS.PASSWORD_STRENGTH.SAFELY_UNGUESSABLE
              ),
              VeryUnGuessable: translate(
                I18N_KEYS.PASSWORD_STRENGTH.VERY_UNGUESSABLE
              ),
              NoScore: translate(I18N_KEYS.PASSWORD_STRENGTH.NONE),
            }}
            isPride={prideColorsEnabled}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <GeneratedPasswordActions
          isPasswordCopied={isPasswordCopied}
          generatedPasswords={generatedPasswordsList}
          onCopyPassword={() => {
            void onCopyPassword();
          }}
          onRefreshPassword={onRefreshPassword}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};
export const GeneratedPassword = React.memo(GeneratedPasswordComponent);
