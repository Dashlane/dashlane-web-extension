import * as React from "react";
import {
  AnalysisStatus,
  autofillSettingsApi,
} from "@dashlane/autofill-contracts";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { Badge, Button, jsx } from "@dashlane/design-system";
import { BrowseComponent, PageView } from "@dashlane/hermes";
import { Website } from "../../../store/types";
import { logPageView } from "../../../libs/logs/logEvent";
import {
  DASHLANE_B2B_DIRECT_BUY,
  GET_PREMIUM_URL,
  openExternalUrl,
} from "../../../libs/externalUrls";
import { useNodePremiumStatus, useSubscriptionCode } from "../../../libs/api";
import useTranslate from "../../../libs/i18n/useTranslate";
import { PreferencesButton } from "../preferences/preferences-button";
import { logAutofillToggledForUrl, logBuyDashlane } from "../logs";
import SettingsDialog from "./settings-dialog";
import { useIsUserFrozen } from "../../../libs/hooks/use-is-user-frozen";
import { isB2BAccount, isBusinessAccount } from "../../helpers";
import styles from "./styles.css";
const I18N_KEYS = {
  PAUSE_BUTTON: "common/action/pause",
  RESUME_BUTTON: "common/action/resume",
  BUY_DASHLANE_BUTTON: "tab/autofill_settings/buy_dashlane",
  PAUSE_BUTTON_ARIA: "tab/autofill_settings/pause_on_current_website_aria",
  RESUME_BUTTON_ARIA: "tab/autofill_settings/resume_on_current_website_aria",
  PAUSE_ON_CURRENT_WEBSITE_TITLE:
    "tab/autofill_settings/pause_on_current_website_title",
  PAUSE_ON_CURRENT_WEBSITE_DESC:
    "tab/autofill_settings/pause_on_current_website_description",
  DISABLED_ON_CURRENT_WEBSITE_DESC:
    "tab/autofill_settings/disabled_on_current_website_description",
  ADMIN_DISABLED_ON_CURRENT_WEBSITE_DESC:
    "tab/autofill_settings/admin_disabled_on_current_website",
  DISCONTINUED_ON_CURRENT_WEBSITE_DESC:
    "tab/autofill_settings/discontinued_on_current_website",
  DISABLED_BY_ADMIN_BADGE: "tab/autofill_settings/disabled_by_admin_badge",
};
interface Props {
  website: Website;
  changeActiveView: () => void;
}
export const AutofillSettingsContent = ({
  website,
  changeActiveView,
}: Props) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const { translate } = useTranslate();
  const { toggleDashlane } = useModuleCommands(autofillSettingsApi);
  const getAutofillSettingsResult = useModuleQuery(
    autofillSettingsApi,
    "getAutofillSettings"
  );
  const getAnalysisStatusOnUrlResult = useModuleQuery(
    autofillSettingsApi,
    "getAnalysisStatusOnUrl",
    { url: website.fullUrl }
  );
  const userFrozenStatus = useIsUserFrozen();
  const { isUserFrozen } = userFrozenStatus;
  const premiumStatus = useNodePremiumStatus();
  const subscriptionCode = useSubscriptionCode();
  const [isSettingsDialogVisible, setIsSettingsDialogVisible] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    logPageView(PageView.SettingsAutofill, BrowseComponent.ExtensionPopup);
  }, []);
  if (userFrozenStatus.isLoading || !premiumStatus) {
    return null;
  }
  const analysisStatusOnUrl =
    getAnalysisStatusOnUrlResult.status === DataStatus.Success
      ? getAnalysisStatusOnUrlResult.data.analysisStatus
      : AnalysisStatus.ANALYSIS_ENABLED;
  const globalAnalysisDisabled =
    getAutofillSettingsResult.status === DataStatus.Success
      ? getAutofillSettingsResult.data.isAutofillDisabled
      : false;
  const isAnalysisDisabledFromAdminConsole =
    analysisStatusOnUrl === AnalysisStatus.ANALYSIS_DISABLED_BY_B2B_ADMIN;
  const isAutofillDisabled =
    analysisStatusOnUrl !== AnalysisStatus.ANALYSIS_ENABLED;
  const isBusiness = isBusinessAccount(premiumStatus);
  const isB2B = isB2BAccount(premiumStatus);
  const buyDashlaneLink = isB2B
    ? `${DASHLANE_B2B_DIRECT_BUY}?plan=${
        isBusiness ? "business" : "team"
      }&subCode=${subscriptionCode ?? ""}`
    : `${GET_PREMIUM_URL}?subCode=${subscriptionCode ?? ""}`;
  const handleOnChangeSettings = async () => {
    if (isUserFrozen) {
      void logBuyDashlane;
      void openExternalUrl(buyDashlaneLink);
      return;
    }
    if (!isAutofillDisabled) {
      setIsSettingsDialogVisible(true);
      return;
    }
    await toggleDashlane({
      isAutofillEnabled: true,
      url: website.fullUrl,
    });
    void logAutofillToggledForUrl(website.domain, "enabled");
  };
  const closeSettingsDialog = () => {
    if (isSettingsDialogVisible) {
      setIsSettingsDialogVisible(false);
      setTimeout(() => buttonRef.current?.focus(), 0);
    }
  };
  const confirmSettingsDialog = async () => {
    await toggleDashlane({
      isAutofillEnabled: false,
      url: website.fullUrl,
    });
    void logAutofillToggledForUrl(website.domain, "disabled");
    closeSettingsDialog();
  };
  const autofillOnWebsiteDescription = translate(
    isUserFrozen
      ? I18N_KEYS.DISCONTINUED_ON_CURRENT_WEBSITE_DESC
      : isAutofillDisabled
      ? isAnalysisDisabledFromAdminConsole
        ? I18N_KEYS.ADMIN_DISABLED_ON_CURRENT_WEBSITE_DESC
        : I18N_KEYS.DISABLED_ON_CURRENT_WEBSITE_DESC
      : I18N_KEYS.PAUSE_ON_CURRENT_WEBSITE_DESC
  );
  return (
    <React.Fragment>
      <div className={styles.content}>
        <div className={styles.autofillOnWebsiteRow} tabIndex={0}>
          <div>
            <h3>{translate(I18N_KEYS.PAUSE_ON_CURRENT_WEBSITE_TITLE)}</h3>
            <p aria-label={autofillOnWebsiteDescription}>
              {autofillOnWebsiteDescription}
            </p>
            <div className={styles.badgeContainer}>
              {isAnalysisDisabledFromAdminConsole ? (
                <Badge
                  iconName="LockOutlined"
                  layout="iconLeading"
                  label={translate(I18N_KEYS.DISABLED_BY_ADMIN_BADGE)}
                />
              ) : null}
              {website.domain ? (
                <Badge
                  iconName="LaptopOutlined"
                  layout="iconLeading"
                  label={website.domain}
                  data-testid="domain-badge"
                />
              ) : null}
            </div>
          </div>
          {isUserFrozen ? (
            <Button
              ref={buttonRef}
              mood={"brand"}
              intensity={"catchy"}
              onClick={() => {
                void handleOnChangeSettings();
              }}
              size="small"
              aria-live="assertive"
              aria-label={translate(I18N_KEYS.BUY_DASHLANE_BUTTON)}
            >
              {translate(I18N_KEYS.BUY_DASHLANE_BUTTON)}
            </Button>
          ) : (
            <Button
              ref={buttonRef}
              mood={isAutofillDisabled ? "brand" : "neutral"}
              intensity={isAutofillDisabled ? "catchy" : "quiet"}
              onClick={() => {
                void handleOnChangeSettings();
              }}
              disabled={
                isAnalysisDisabledFromAdminConsole ||
                !website.domain ||
                globalAnalysisDisabled
              }
              size="small"
              aria-live="assertive"
              aria-label={translate(
                isAutofillDisabled
                  ? I18N_KEYS.RESUME_BUTTON_ARIA
                  : I18N_KEYS.PAUSE_BUTTON_ARIA
              )}
            >
              {translate(
                isAutofillDisabled
                  ? I18N_KEYS.RESUME_BUTTON
                  : I18N_KEYS.PAUSE_BUTTON
              )}
            </Button>
          )}
        </div>
        <PreferencesButton onClick={changeActiveView} />
      </div>
      <SettingsDialog
        visible={isSettingsDialogVisible}
        onConfirm={() => {
          void confirmSettingsDialog();
        }}
        onCancel={closeSettingsDialog}
      />
    </React.Fragment>
  );
};
