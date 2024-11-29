import { useEffect } from "react";
import { PageView } from "@dashlane/hermes";
import { Tab } from "../shared/tab";
import { EmailPreferenceCenterWrapper } from "./email-preferences/email-preference-setting-wrapper";
import { TermsAndPrivacySettings } from "./terms-and-privacy-settings";
import { DataRightsSection } from "./data-rights-section";
import { logPageView } from "../../../libs/logs/logEvent";
import { Lee } from "../../../lee";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  PAGE_TITLE: "webapp_privacy_settings_page_title",
};
export const PrivacySettings = ({ lee }: { lee: Lee }) => {
  const { translate } = useTranslate();
  const isEu = lee.carbon.currentLocation.isEu;
  useEffect(() => {
    logPageView(PageView.PrivacySettings);
  }, []);
  return (
    <Tab name={translate(I18N_KEYS.PAGE_TITLE)}>
      <EmailPreferenceCenterWrapper />
      {isEu ? (
        <>
          <TermsAndPrivacySettings />
          <DataRightsSection />
        </>
      ) : null}
    </Tab>
  );
};
