import * as React from "react";
import { Website } from "../../store/types";
import useTranslate from "../../libs/i18n/useTranslate";
import { SettingsView } from "./settings/settings-view";
import { PreferencesView } from "./preferences/preferences-view";
import styles from "./styles.css";
export interface AutofillSettingsProps {
  website: Website;
}
type AutofillSettingsView = "Settings" | "Preferences";
const I18N_KEYS = {
  HEADER: "tab/autofill_settings/autofill",
};
export const AutofillSettings = React.memo(function AutofillSettings({
  website,
}: AutofillSettingsProps) {
  const { translate } = useTranslate();
  const [activeView, setActiveView] =
    React.useState<AutofillSettingsView>("Settings");
  return (
    <div
      className={styles.wrapper}
      aria-label={translate(I18N_KEYS.HEADER)}
      tabIndex={0}
    >
      {activeView === "Settings" ? (
        <SettingsView
          website={website}
          handleClickGoToPreferences={() => setActiveView("Preferences")}
        />
      ) : null}
      {activeView === "Preferences" ? (
        <PreferencesView
          handleClickBackToSettings={() => setActiveView("Settings")}
        />
      ) : null}
    </div>
  );
});
