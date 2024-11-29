import { useEffect, useState } from "react";
import { RequiredExtensionSettings } from "@dashlane/communication";
import { useGlobalExtensionSettings } from "./hooks/useGlobalExtensionSettings";
import { GlobalExtensionConsent } from "./components/global-extension-consent";
import { SetupLayout } from "../webapp/layout/setup-layout";
interface PrivacyConsentProps {
  children: JSX.Element;
}
export const PrivacyConsent = ({ children }: PrivacyConsentProps) => {
  const { setUserConsent, getUserConsent } = useGlobalExtensionSettings();
  const initNeedsConsent = APP_PACKAGED_FOR_FIREFOX ? undefined : false;
  const [showPrivacyConsentPage, setShowPrivacyConsentPage] = useState<
    boolean | undefined
  >(initNeedsConsent);
  const handleConsentSubmit = async (consents: RequiredExtensionSettings) => {
    await setUserConsent(consents);
    setShowPrivacyConsentPage(false);
  };
  useEffect(() => {
    if (showPrivacyConsentPage === undefined) {
      getUserConsent().then((consents) => {
        if (
          consents.interactionDataConsent === null &&
          consents.personalDataConsent === null
        ) {
          setShowPrivacyConsentPage(true);
          return;
        }
        setShowPrivacyConsentPage(false);
      });
    }
  }, [getUserConsent, showPrivacyConsentPage]);
  if (!showPrivacyConsentPage) {
    return children;
  }
  return (
    <SetupLayout>
      <GlobalExtensionConsent handleConsentSet={handleConsentSubmit} />
    </SetupLayout>
  );
};
