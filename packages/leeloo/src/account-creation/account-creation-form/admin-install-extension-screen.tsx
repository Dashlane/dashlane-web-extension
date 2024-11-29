import { useEffect } from "react";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Paragraph,
} from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { openUrl } from "../../libs/external-urls";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import { getUrlSearchParams } from "../../libs/router";
import { createSignUpCookie } from "../helpers";
import { logAdminInstallExtensionClick, logNavigateAway } from "./logs";
import { AccountCreationFlowType } from "../types";
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from "../../webapp/urls";
const I18N_KEYS = {
  NO_EXTENSION_HEADER:
    "webapp_auth_panel_account_creation_admin_no_extension_header",
  NO_EXTENSION_DESCRIPTION:
    "webapp_auth_panel_account_creation_admin_no_extension_header_description",
  TRY_AUTOFILL: "webapp_auth_panel_account_creation_admin_try_autofill_text",
  TRY_LOGINS:
    "webapp_auth_panel_account_creation_admin_try_automatically_save_text",
  TRY_VAULT: "webapp_auth_panel_account_creation_admin_try_vault_text",
  BUTTON_INSTALL:
    "webapp_auth_panel_account_creation_admin_button_install_extension",
  BUTTON_SKIP:
    "webapp_auth_panel_account_creation_admin_button_skip_extension_install",
};
interface AdminInstallExtensionScreenProps {
  onSkipInstallExtension: () => void;
}
export const AdminInstallExtensionScreen = ({
  onSkipInstallExtension,
}: AdminInstallExtensionScreenProps) => {
  const { translate } = useTranslate();
  const handleInstallExtensionClick = () => {
    const urlParams = getUrlSearchParams();
    const login = urlParams.get("email") ?? "";
    createSignUpCookie({ login, flowType: AccountCreationFlowType.ADMIN });
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
    <Flex flexDirection="column" sx={{ margin: "0px 80px" }} gap={4}>
      <Heading
        as="h1"
        textStyle="ds.title.section.medium"
        color="ds.text.neutral.catchy"
      >
        {translate(I18N_KEYS.NO_EXTENSION_HEADER)}
      </Heading>
      <Paragraph
        textStyle="ds.title.section.large"
        color="ds.text.neutral.catchy"
        sx={{ paddingBottom: "12px" }}
      >
        {translate(I18N_KEYS.NO_EXTENSION_DESCRIPTION)}
      </Paragraph>
      <Flex flexDirection="column" gap={"20px"} sx={{ paddingBottom: "20px" }}>
        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 1fr auto",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div
            sx={{
              borderRadius: "8px",
              backgroundColor: "ds.container.expressive.brand.quiet.disabled",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40px",
              width: "40px",
            }}
          >
            <Icon
              size="medium"
              name={"FeatureAutofillOutlined"}
              color={"ds.text.brand.standard"}
            />
          </div>
          <Paragraph
            color="ds.text.neutral.catchy"
            textStyle="ds.title.block.medium"
          >
            {translate(I18N_KEYS.TRY_AUTOFILL)}
          </Paragraph>
        </div>

        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 1fr auto",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div
            sx={{
              borderRadius: "8px",
              backgroundColor: "ds.container.expressive.brand.quiet.disabled",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40px",
              width: "40px",
            }}
          >
            <Icon
              size="medium"
              name={"WebOutlined"}
              color={"ds.text.brand.standard"}
            />
          </div>
          <Paragraph
            color="ds.text.neutral.catchy"
            textStyle="ds.title.block.medium"
          >
            {translate(I18N_KEYS.TRY_LOGINS)}
          </Paragraph>
        </div>

        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "40px 1fr auto",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div
            sx={{
              borderRadius: "8px",
              backgroundColor: "ds.container.expressive.brand.quiet.disabled",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40px",
              width: "40px",
            }}
          >
            <Icon
              size="medium"
              name={"ProtectionOutlined"}
              color={"ds.text.brand.standard"}
            />
          </div>
          <Paragraph
            color="ds.text.neutral.catchy"
            textStyle="ds.title.block.medium"
          >
            {translate(I18N_KEYS.TRY_VAULT)}
          </Paragraph>
        </div>
      </Flex>

      <Button
        onClick={handleInstallExtensionClick}
        mood="brand"
        icon="ActionOpenExternalLinkOutlined"
        layout="iconTrailing"
        fullsize={true}
        sx={{ marginTop: "8px" }}
      >
        {translate(I18N_KEYS.BUTTON_INSTALL)}
      </Button>
      <Button
        onClick={onSkipInstallExtension}
        size="large"
        mood="neutral"
        intensity="quiet"
        fullsize={true}
      >
        {translate(I18N_KEYS.BUTTON_SKIP)}
      </Button>
    </Flex>
  );
};
