import { useCallback, useEffect, useState } from "react";
import { jsx, ToastProvider } from "@dashlane/design-system";
import { useDispatch, useSelector } from "react-redux";
import { TabPanel, Tabs } from "react-tabs";
import classNames from "classnames";
import { LiveDataStatus } from "@dashlane/carbon-api-consumers";
import {
  PasswordGenerationSettings,
  WebOnboardingLeelooStep,
  WebOnboardingModeEvent,
  WebOnboardingPopoverStep,
} from "@dashlane/communication";
import {
  AuthenticationStatus,
  PageView,
  UserOpenExtensionEvent,
} from "@dashlane/hermes";
import { DataStatus, useFeatureFlips } from "@dashlane/framework-react";
import { tabsQuery } from "@dashlane/webextensions-apis";
import { Kernel } from "../kernel";
import { WebsiteInfo } from "../eventManager/types";
import { App as AppState } from "../store/types";
import { accountFeaturesUpdated, websiteUpdated } from "../store/reducers/app";
import { AppTabs } from "./tabs/tabs";
import { Vault } from "./vault/vault";
import { MoreTools } from "./more-tools/more-tools";
import { AutofillSettings } from "./autofillSettings";
import { Generator } from "./generator/Generator";
import { ProtectedItemsUnlockerContextProvider } from "./protected-items-unlocker/protected-items-unlocker-context";
import { VaultItemDetailViewProvider } from "./vault/detail-views/vault-item-detail-view-provider";
import { SpacesProvider } from "./vault/spaces-context";
import { PerformanceMarker, performanceMethods } from "../libs/performance";
import { logEvent, logPageView } from "../libs/logs/logEvent";
import {
  getSavedPasswordGenerationSettings,
  useLiveChangeMasterPasswordStatus,
  usePremiumStatusData,
} from "../libs/api";
import { Footer } from "./footer/footer";
import { ChangeMasterPasswordProgress } from "./changeMasterPassword/change-master-password-progress";
import { Enforce2FAOverlay } from "./enforce-2FA-overlay/enforce-2FA-overlay";
import { useFooterAlertHubContext } from "./footer/footer-alert-hub/footer-alert-hub-context";
import { carbonConnector } from "../carbonConnector";
import { extractValidDomainForTab } from "./domainHelpers";
import { useWebOnboardingMode } from "../libs/api/webOnboardingMode/useWebOnboardingMode";
import { TOAST_PORTAL_ID } from "./constants";
import { useActiveSectionTabContext } from "./tabs/active-section-tab-context";
import { getTabNumbers, isAccountBusinessAdmin } from "./helpers";
import { Admin } from "./admin/Admin";
import useTranslate from "../libs/i18n/useTranslate";
import { useUserLogin } from "../libs/api/session/useUserLogin";
import styles from "./main.css";
const defaultGeneratorSettings: PasswordGenerationSettings = {
  length: 16,
  digits: true,
  letters: true,
  symbols: true,
  avoidAmbiguous: true,
};
export interface MainProps {
  kernel: Kernel;
}
export const Main = (props: MainProps) => {
  const webOnboardingMode = useWebOnboardingMode();
  const premiumStatusData = usePremiumStatusData();
  const currentUserLogin = useUserLogin();
  const { isFooterAlertHubOpen } = useFooterAlertHubContext();
  const premiumStatus =
    premiumStatusData.status === DataStatus.Success
      ? premiumStatusData.data
      : null;
  const isBusinessAdmin = isAccountBusinessAdmin(premiumStatus);
  const { translate } = useTranslate();
  const { activeTab, setActiveTab } = useActiveSectionTabContext();
  const [appReady, setAppReady] = useState(false);
  const [canShowChangeMPProgress, setCanShowChangeMPProgress] = useState(true);
  const [savedGeneratorOptions, setNewSavedGeneratorOptions] = useState(
    defaultGeneratorSettings
  );
  const appState = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const changeMPProgress = useLiveChangeMasterPasswordStatus();
  const triggerAppReadyEvent = (): void => {
    setAppReady(true);
    window.dispatchEvent(new Event("display-app"));
  };
  const handleCurrentWebsite = (website: WebsiteInfo) => {
    dispatch(
      websiteUpdated({
        autofillDisabledOnSite: website.disabledAutofillOnDomain,
        autofillDisabledOnPage: website.disabledAutofillOnPage,
        autologinDisabledOnSite: website.disabledAutologinOnDomain,
        autologinDisabledOnPage: website.disabledAutologinOnPage,
        disabledFromSpaces: website.disabledFromSpaces,
        domain: website.domain,
        fullUrl: website.fullUrl,
      })
    );
  };
  const logActiveTabPageView = useCallback(() => {
    const tabNumberToPageView: PageView[] = [
      PageView.ItemCredentialList,
      PageView.SettingsAutofill,
      PageView.ToolsPasswordGenerator,
      PageView.SettingsMore,
    ];
    if (isBusinessAdmin) {
      tabNumberToPageView.splice(1, 0, PageView.AdminConsolePreview);
    }
    const pageView = tabNumberToPageView[activeTab];
    logPageView(pageView);
  }, [activeTab]);
  useEffect(() => {
    logActiveTabPageView();
  }, [activeTab, logActiveTabPageView]);
  async function setCurrentWebsiteInfo() {
    const queryOptions = { active: true, currentWindow: true };
    const tabs = await tabsQuery(queryOptions);
    const fullUrl = tabs[0].url ?? "";
    const validDomain = extractValidDomainForTab(fullUrl);
    const websiteInfo = await carbonConnector.askWebsiteInfo({ fullUrl });
    const currentTabInfo = { ...websiteInfo, domain: validDomain, fullUrl };
    handleCurrentWebsite(currentTabInfo);
  }
  const requestData = () => {
    void setCurrentWebsiteInfo();
    performanceMethods.measure(
      "Logging in extension side",
      PerformanceMarker.LOGIN_CLICK
    );
    void carbonConnector.getFeatures().then((accountFeatures) => {
      dispatch(accountFeaturesUpdated(accountFeatures));
    });
    void getSavedPasswordGenerationSettings().then((settings) => {
      setNewSavedGeneratorOptions(settings);
    });
  };
  useEffect(() => {
    performanceMethods.measure(
      "Mounting main app component",
      PerformanceMarker.POPUP_INITIALISED
    );
    requestData();
    void logEvent(
      new UserOpenExtensionEvent({
        authenticationStatus: AuthenticationStatus.LoggedIn,
      })
    );
    logActiveTabPageView();
    if (appReady) {
      return;
    }
    triggerAppReadyEvent();
  }, []);
  useEffect(() => {
    if (
      webOnboardingMode?.flowLoginCredentialOnWeb &&
      webOnboardingMode.leelooStep ===
        WebOnboardingLeelooStep.SHOW_LOGIN_USING_EXTENSION_NOTIFICATION
    ) {
      const newWebOnboardingMode: WebOnboardingModeEvent = {
        flowCredentialInApp: false,
        flowLoginCredentialOnWeb: true,
        flowSaveCredentialOnWeb: false,
        popoverStep: WebOnboardingPopoverStep.SHOW_LOGIN_NOTIFICATION,
        leelooStep: null,
        completedSteps: webOnboardingMode.completedSteps,
      };
      void carbonConnector.updateWebOnboardingMode(newWebOnboardingMode);
    }
  }, [webOnboardingMode]);
  const handleTabClick = (tabNumber: number) => {
    setActiveTab(tabNumber);
  };
  const handleSaveGeneratorOptions = (newOptions: PasswordGenerationSettings) =>
    setNewSavedGeneratorOptions(newOptions);
  const tabNumber = getTabNumbers(isBusinessAdmin);
  const isFooterVisible = activeTab !== tabNumber.MORE_TOOLS;
  const getTabsView = () => {
    const selectedIndex = activeTab || 0;
    return appState.website ? (
      <Tabs
        onSelect={handleTabClick}
        selectedIndex={selectedIndex}
        className={classNames(
          styles["tab-base-container"],
          isFooterVisible
            ? styles["tab-container"]
            : styles["more-tab-container"],
          isFooterAlertHubOpen ? styles["tab-container-with-banner"] : undefined
        )}
        selectedTabPanelClassName={styles["selected-tab"]}
      >
        {AppTabs({
          selectedIndex,
          kernel: props.kernel,
          isBusinessAdmin,
        })}

        <Enforce2FAOverlay />

        <TabPanel>
          {activeTab === tabNumber.VAULT ? (
            <Vault
              webOnboardingMode={webOnboardingMode}
              dispatch={dispatch}
              website={appState.website}
            />
          ) : null}
        </TabPanel>

        {isBusinessAdmin ? (
          <TabPanel>
            {activeTab === tabNumber.ADMIN ? <Admin /> : null}
          </TabPanel>
        ) : null}

        <TabPanel>
          {activeTab === tabNumber.AUTOFILL ? (
            <AutofillSettings website={appState.website} />
          ) : null}
        </TabPanel>

        <TabPanel>
          {activeTab === tabNumber.GENERATOR ? (
            <Generator
              savedOptions={savedGeneratorOptions}
              onSaveGeneratorOptions={handleSaveGeneratorOptions}
            />
          ) : null}
        </TabPanel>

        <TabPanel>
          {activeTab === tabNumber.MORE_TOOLS && currentUserLogin ? (
            <MoreTools login={currentUserLogin} />
          ) : null}
        </TabPanel>
      </Tabs>
    ) : (
      <Tabs selectedIndex={selectedIndex}>
        {AppTabs({
          selectedIndex,
          kernel: props.kernel,
          isBusinessAdmin,
        })}
      </Tabs>
    );
  };
  const handleOpenUserVault = () => {
    setCanShowChangeMPProgress(false);
  };
  return changeMPProgress.status === LiveDataStatus.Received &&
    canShowChangeMPProgress ? (
    <ChangeMasterPasswordProgress
      changeMPProgress={changeMPProgress}
      onOpenUserVault={handleOpenUserVault}
    />
  ) : (
    <ToastProvider
      portalId={TOAST_PORTAL_ID}
      defaultCloseActionLabel={translate("_common_toast_close_label")}
      sectionName={translate("_common_toast_section_name")}
      itemName={translate("_common_toast_item_name")}
    >
      <ProtectedItemsUnlockerContextProvider>
        <SpacesProvider>
          <VaultItemDetailViewProvider onCloseModal={logActiveTabPageView}>
            {getTabsView()}
          </VaultItemDetailViewProvider>
        </SpacesProvider>
      </ProtectedItemsUnlockerContextProvider>
      {isFooterVisible && <Footer />}

      <div id="modal" className={styles["modal-container"]} />

      <div id="dialog" className={styles.dialog} />

      <div id={TOAST_PORTAL_ID} />
    </ToastProvider>
  );
};
