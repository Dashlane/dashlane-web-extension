import { Action } from "redux";
import { WebOnboardingModeEvent } from "@dashlane/communication";
import { jsx } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { Website } from "../../store/types";
import ActiveVaultTypeTabList from "./active-tab-list/active-vault-type-tab-list";
import { EmbeddedAlertWrapper } from "./embedded-alert-hub/embedded-alert-hub";
import { OverlayAlertHub } from "./overlay-alert-hub/overlay-alert-hub";
import { SearchProvider } from "./search-field/search-context";
import { TabsBar } from "./tabs-bar/tabs-bar";
import styles from "./styles.css";
const I18N_KEYS = {
  VAULT: "tab/all_items/title_vault",
};
export interface VaultProps {
  dispatch: (action: Action) => void;
  webOnboardingMode: WebOnboardingModeEvent | null;
  website: Website;
}
export const Vault = ({ dispatch, webOnboardingMode, website }: VaultProps) => {
  const { translate } = useTranslate();
  return (
    <div
      className={styles.wrapper}
      sx={{ backgroundColor: "ds.container.agnostic.neutral.standard" }}
      role="heading"
      aria-level={1}
      aria-label={translate(I18N_KEYS.VAULT)}
      tabIndex={-1}
    >
      <SearchProvider>
        <TabsBar />
        <EmbeddedAlertWrapper
          dispatch={dispatch}
          webOnboardingMode={webOnboardingMode}
        />
        <ActiveVaultTypeTabList website={website} />
        <OverlayAlertHub />
      </SearchProvider>
    </div>
  );
};
