import * as React from "react";
import { GeneratedPasswordItemView } from "@dashlane/communication";
import { GeneratedPasswordRow } from "../Row/Row";
import styles from "../styles.css";
import useTranslate from "../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  END_NOTE: "passwordGeneratedHistory/endNote",
};
interface PasswordGeneratedHistoryListProps {
  generatedPasswords: GeneratedPasswordItemView[];
  onCopy: (password: string, id: string, domain?: string) => void;
}
export const PasswordGeneratedHistoryList: React.FC<PasswordGeneratedHistoryListProps> =
  React.memo(function PasswordGeneratedHistoryList({
    generatedPasswords,
    onCopy,
  }) {
    const { translate } = useTranslate();
    return (
      <div className={styles.list}>
        {generatedPasswords.map((generatedPassword, index) => (
          <GeneratedPasswordRow
            onCopy={onCopy}
            generatedPassword={generatedPassword}
            key={index}
            index={index}
          />
        ))}

        {generatedPasswords.length === 20 && (
          <div className={styles.endNote}>{translate(I18N_KEYS.END_NOTE)}</div>
        )}
      </div>
    );
  });
