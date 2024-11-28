import * as React from "react";
import { GeneratedPasswordItemView } from "@dashlane/communication";
import { PageView } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../libs/logs/logEvent";
import { FixedWidthButton } from "./fixed-width-button";
import { GeneratedPasswordHistory } from "./generated-password-history";
import styles from "./generated-password-actions.css";
const I18N_KEYS = {
  COPY_PASSWORD: "tab/generate/copy_password/do_copy",
  PASSWORD_COPIED: "tab/generate/copy_password/copied",
};
interface Props {
  isPasswordCopied: boolean;
  generatedPasswords: GeneratedPasswordItemView[];
  onRefreshPassword: () => void;
  onCopyPassword: () => void;
  isDisabled: boolean;
}
const GeneratedPasswordActionsComponent = ({
  onCopyPassword,
  isPasswordCopied,
  generatedPasswords,
  isDisabled,
}: Props) => {
  const { translate } = useTranslate();
  const logPasswordGeneratorPageView = () => {
    logPageView(PageView.ToolsPasswordGenerator);
  };
  return (
    <div className={styles.buttons}>
      <GeneratedPasswordHistory
        generatedPasswords={generatedPasswords}
        onCloseModal={logPasswordGeneratorPageView}
        isDisabled={generatedPasswords.length === 0 || isDisabled}
      />

      <FixedWidthButton
        id="copyButton"
        onClick={onCopyPassword}
        disabled={isPasswordCopied || isDisabled}
        textList={[
          translate(I18N_KEYS.PASSWORD_COPIED),
          translate(I18N_KEYS.COPY_PASSWORD),
        ]}
        textIndex={isPasswordCopied ? 0 : 1}
      />
    </div>
  );
};
export const GeneratedPasswordActions = React.memo(
  GeneratedPasswordActionsComponent
);
