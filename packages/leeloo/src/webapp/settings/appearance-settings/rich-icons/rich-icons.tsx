import { useState } from "react";
import { LinkButton } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Setting } from "../../shared/setting";
import { OptionWithIllustration } from "../../shared/option-with-illustration";
import illustrationSettingRichIconsEnabled from "./images/rich-icons-enabled@2x.png";
import illustrationSettingRichIconsDisabled from "./images/rich-icons-disabled@2x.png";
const I18N_KEYS = {
  SETTING_RICH_ICONS_TITLE: "webapp_appearance_settings_rich_icons_title",
  SETTING_RICH_ICONS_DESCRIPTION:
    "webapp_appearance_settings_rich_icons_description",
  SETTING_RICH_ICONS_ENABLED: "webapp_appearance_settings_rich_icons_enabled",
  SETTING_RICH_ICONS_DISABLED: "webapp_appearance_settings_rich_icons_disabled",
  SETTING_RICH_ICONS_LEARN_MORE:
    "webapp_appearance_settings_rich_icons_learn_more",
};
export const RichIcons = () => {
  const { translate } = useTranslate();
  const [richIconsOption, setRichIconsOption] = useState("enabled");
  return (
    <Setting
      title={translate(I18N_KEYS.SETTING_RICH_ICONS_TITLE)}
      description={translate(I18N_KEYS.SETTING_RICH_ICONS_DESCRIPTION)}
    >
      <OptionWithIllustration
        setOption={setRichIconsOption}
        option={richIconsOption}
        optionsList={[
          {
            label: translate(I18N_KEYS.SETTING_RICH_ICONS_ENABLED),
            optionKey: "enabled",
            illustrationSrc: illustrationSettingRichIconsEnabled,
          },
          {
            label: translate(I18N_KEYS.SETTING_RICH_ICONS_DISABLED),
            optionKey: "disabled",
            illustrationSrc: illustrationSettingRichIconsDisabled,
          },
        ]}
      />

      <LinkButton
        href="__REDACTED__"
        sx={{ marginTop: "24px" }}
        isExternal={true}
      >
        {translate(I18N_KEYS.SETTING_RICH_ICONS_LEARN_MORE)}
      </LinkButton>
    </Setting>
  );
};
