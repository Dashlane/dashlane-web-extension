import { useState } from "react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { OptionWithIllustration } from "../../shared/option-with-illustration";
import { Setting } from "../../shared/setting";
import illustrationSettingColorThemeSystem from "./images/color-theme-system@2x.png";
import illustrationSettingColorThemeLight from "./images/color-theme-light@2x.png";
import illustrationSettingColorThemeDark from "./images/color-theme-dark@2x.png";
import illustrationSettingColorThemeDebug from "./images/color-theme-debug@2x.png";
const I18N_KEYS = {
  SETTING_COLOR_THEME_TITLE: "webapp_appearance_settings_color_theme_title",
  SETTING_COLOR_THEME_DESCRIPTION:
    "webapp_appearance_settings_color_theme_description",
  SETTING_COLOR_THEME_SYSTEM: "webapp_appearance_settings_color_theme_system",
  SETTING_COLOR_THEME_LIGHT: "webapp_appearance_settings_color_theme_light",
  SETTING_COLOR_THEME_DEBUG: "webapp_appearance_settings_color_theme_debug",
  SETTING_COLOR_THEME_DARK: "webapp_appearance_settings_color_theme_dark",
};
export const ColorTheme = () => {
  const { translate } = useTranslate();
  const [colorThemeOption, setColorThemeOption] = useState("system");
  return (
    <Setting
      title={translate(I18N_KEYS.SETTING_COLOR_THEME_TITLE)}
      description={translate(I18N_KEYS.SETTING_COLOR_THEME_DESCRIPTION)}
    >
      <OptionWithIllustration
        setOption={setColorThemeOption}
        option={colorThemeOption}
        optionsList={[
          {
            label: translate(I18N_KEYS.SETTING_COLOR_THEME_LIGHT),
            optionKey: "light",
            illustrationSrc: illustrationSettingColorThemeLight,
          },
          {
            label: translate(I18N_KEYS.SETTING_COLOR_THEME_DARK),
            optionKey: "dark",
            illustrationSrc: illustrationSettingColorThemeDark,
          },
          {
            label: translate(I18N_KEYS.SETTING_COLOR_THEME_SYSTEM),
            optionKey: "system",
            illustrationSrc: illustrationSettingColorThemeSystem,
          },
          {
            label: translate(I18N_KEYS.SETTING_COLOR_THEME_DEBUG),
            optionKey: "debug",
            illustrationSrc: illustrationSettingColorThemeDebug,
          },
        ]}
      />
    </Setting>
  );
};
