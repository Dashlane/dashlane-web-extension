import {
  Button,
  Heading,
  Icon,
  IconProps,
  Paragraph,
} from "@dashlane/design-system";
import { openUrl } from "../../../../../libs/external-urls";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { DOWNLOAD_DASHLANE } from "../../../../../team/urls";
import illustration from "@dashlane/design-system/assets/illustrations/autofill-never-forget-password@2x-light.webp";
import { logTaskInstallExtensionClick } from "../../logs";
import { useSignUpCookie } from "../../../../../account-creation/hooks/use-signup-cookie";
import { AccountCreationFlowType } from "../../../../../account-creation/types";
import { ONBOARDING_TASKS_STYLE } from "../style";
export const I18N_KEYS = {
  TITLE: "onb_vault_get_started_task_install_extension_title",
  FEATURE_AUTOFILL:
    "onb_vault_get_started_task_install_extension_feature_autofill",
  FEATURE_SAVE: "onb_vault_get_started_task_install_extension_feature_save",
  FEATURE_SEAMLESS_NAVIGATION:
    "onb_vault_get_started_task_install_extension_feature_seamless_navigation",
  BUTTON: "onb_vault_get_started_task_install_extension_button",
};
const FeatureItem = ({
  icon,
  name,
}: {
  icon: IconProps["name"];
  name: string;
}) => {
  const { translate } = useTranslate();
  const color = "ds.text.neutral.standard";
  return (
    <li
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "4px 0",
      }}
    >
      <Icon color={color} name={icon} />
      <Paragraph
        color={color}
        textStyle="ds.body.reduced.regular"
        sx={{ marginLeft: "8px" }}
      >
        {translate(name)}
      </Paragraph>
    </li>
  );
};
export const InstallExtensionTask = ({
  isInExtensionOrDesktop,
}: {
  isInExtensionOrDesktop: boolean;
}) => {
  const { translate } = useTranslate();
  const { setCookie } = useSignUpCookie();
  const handleInstallExtension = () => {
    setCookie(AccountCreationFlowType.ADMIN);
    logTaskInstallExtensionClick();
    openUrl(DOWNLOAD_DASHLANE);
  };
  if (isInExtensionOrDesktop) {
    return null;
  }
  return (
    <div sx={ONBOARDING_TASKS_STYLE.JUMBOTRON_CONTAINER}>
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "265px",
        }}
      >
        <Heading
          as="h2"
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.TITLE)}
        </Heading>

        <div>
          <ul>
            <FeatureItem
              icon={"FeatureAutofillOutlined"}
              name={I18N_KEYS.FEATURE_AUTOFILL}
            />
            <FeatureItem
              icon={"ItemLoginOutlined"}
              name={I18N_KEYS.FEATURE_SAVE}
            />
            <FeatureItem
              icon={"VaultOutlined"}
              name={I18N_KEYS.FEATURE_SEAMLESS_NAVIGATION}
            />
          </ul>
        </div>

        <Button
          mood="brand"
          icon="ActionOpenExternalLinkOutlined"
          layout="iconTrailing"
          sx={{ marginTop: "8px" }}
          onClick={handleInstallExtension}
        >
          {translate(I18N_KEYS.BUTTON)}
        </Button>
      </div>

      <img
        sx={{
          userSelect: "none",
          pointerEvents: "none",
          width: "300px",
          maxWidth: "100%",
          margin: "0 auto",
        }}
        alt=""
        aria-hidden={true}
        src={illustration}
      />
    </div>
  );
};
