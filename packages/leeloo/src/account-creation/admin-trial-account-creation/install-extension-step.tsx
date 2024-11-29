import { useEffect } from "react";
import { Button, Flex } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { logPageView } from "../../libs/logs/logEvent";
import useTranslate from "../../libs/i18n/useTranslate";
import { openUrl } from "../../libs/external-urls";
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from "../../webapp/urls";
import { logAdminInstallExtensionClick } from "../account-creation-form/logs";
import installExtension from "./assets/download_extension.png";
import { logNavigateAway } from "../logs";
import { createSignUpCookie } from "../helpers";
import { AccountCreationFlowType } from "../types";
import { StepCard } from "./step-card/step-card";
export const I18N_KEYS = {
  CONFIRMED_AS: "webapp_auth_panel_install_extension_email",
  TITLE: "webapp_auth_panel_install_extension_title",
  DESCRIPTION: "webapp_auth_panel_install_extension_description",
  ADD: "webapp_auth_panel_install_extension_add_button",
  SKIP: "webapp_auth_panel_install_extension_skip_button",
};
interface Props {
  email: string;
  showSkipInstallButton: boolean;
  handleSkipButton: () => void;
}
export const InstallExtensionStep = ({
  email,
  showSkipInstallButton,
  handleSkipButton,
}: Props) => {
  const { translate } = useTranslate();
  const handleInstallExtensionClick = () => {
    createSignUpCookie({
      login: email,
      flowType: AccountCreationFlowType.ADMIN,
      withNewFlow: true,
      showSkipInstallButton,
    });
    openUrl(DASHLANE_DOWNLOAD_EXTENSION_URL);
    logAdminInstallExtensionClick();
  };
  useEffect(() => {
    logPageView(PageView.AccountCreationInstallExtension);
  }, []);
  useEffect(() => {
    window.addEventListener("beforeunload", logNavigateAway);
    return () => {
      window.removeEventListener("beforeunload", logNavigateAway);
    };
  }, []);
  return (
    <StepCard
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
      tag={
        email
          ? {
              leadingIcon: "CheckmarkOutlined",
              label: translate(I18N_KEYS.CONFIRMED_AS, {
                email,
              }),
            }
          : undefined
      }
    >
      <Flex
        sx={{
          justifyContent: "center",
          flex: 1,
          backgroundColor: "ds.background.alternate",
          padding: "16px 24px",
        }}
      >
        <img
          role="presentation"
          alt={translate(I18N_KEYS.ADD)}
          src={installExtension}
          sx={{ objectFit: "contain", width: "70%", height: "auto" }}
        />
      </Flex>

      <Flex flexDirection="column" alignItems="center" gap="12px">
        <Button
          intensity="catchy"
          icon="ActionOpenExternalLinkOutlined"
          layout="iconTrailing"
          onClick={handleInstallExtensionClick}
          size="large"
        >
          {translate(I18N_KEYS.ADD)}
        </Button>

        {showSkipInstallButton ? (
          <Button
            mood="neutral"
            intensity="supershy"
            size="large"
            onClick={handleSkipButton}
          >
            {translate(I18N_KEYS.SKIP)}
          </Button>
        ) : null}
      </Flex>
    </StepCard>
  );
};
