import React from "react";
import useTranslate from "../libs/i18n/useTranslate";
import { PasswordTip } from "./password-tip/password-tip";
const I18N_KEYS = {
  GENERAL_RULES_TITLE:
    "webapp_account_security_settings_passwordtips_general_rules_title",
  GENERAL_RULES_DESCRIPTION_1:
    "webapp_account_security_settings_passwordtips_general_rules_description_1",
  GENERAL_RULES_DESCRIPTION_2:
    "webapp_account_security_settings_passwordtips_general_rules_description_2",
  GENERAL_RULES_DESCRIPTION_3:
    "webapp_account_security_settings_passwordtips_general_rules_description_3",
  STORY_METHOD_TITLE:
    "webapp_account_security_settings_passwordtips_story_method_title",
  STORY_METHOD_DESCRIPTION:
    "webapp_account_security_settings_passwordtips_story_method_description",
  STORY_METHOD_EXAMPLE:
    "webapp_account_security_settings_passwordtips_story_method_example",
  SERIES_WORDS_TITLE:
    "webapp_account_security_settings_passwordtips_series_words_title",
  SERIES_WORDS_DESCRIPTION:
    "webapp_account_security_settings_passwordtips_series_words_description",
  SERIES_WORDS_EXAMPLE:
    "webapp_account_security_settings_passwordtips_series_words_example",
  LETTERS_NUMBERS_TITLE:
    "webapp_account_security_settings_passwordtips_letters_numbers_title",
  LETTERS_NUMBERS_DESCRIPTION:
    "webapp_account_security_settings_passwordtips_letters_numbers_description",
  LETTERS_NUMBERS_EXAMPLE:
    "webapp_account_security_settings_passwordtips_letters_numbers_example",
};
export const PasswordTipsContent = () => {
  const { translate } = useTranslate();
  return (
    <>
      <PasswordTip
        title={translate(I18N_KEYS.GENERAL_RULES_TITLE)}
        description={
          <ul>
            <li>{translate(I18N_KEYS.GENERAL_RULES_DESCRIPTION_1)}</li>
            <li>{translate(I18N_KEYS.GENERAL_RULES_DESCRIPTION_2)}</li>
            <li>{translate(I18N_KEYS.GENERAL_RULES_DESCRIPTION_3)}</li>
          </ul>
        }
      />

      <PasswordTip
        title={translate(I18N_KEYS.STORY_METHOD_TITLE)}
        description={translate(I18N_KEYS.STORY_METHOD_DESCRIPTION)}
        example={translate(I18N_KEYS.STORY_METHOD_EXAMPLE)}
      />

      <PasswordTip
        title={translate(I18N_KEYS.SERIES_WORDS_TITLE)}
        description={translate(I18N_KEYS.SERIES_WORDS_DESCRIPTION)}
        example={translate(I18N_KEYS.SERIES_WORDS_EXAMPLE)}
      />

      <PasswordTip
        title={translate(I18N_KEYS.LETTERS_NUMBERS_TITLE)}
        description={translate(I18N_KEYS.LETTERS_NUMBERS_DESCRIPTION)}
        example={translate(I18N_KEYS.LETTERS_NUMBERS_EXAMPLE)}
      />
    </>
  );
};
