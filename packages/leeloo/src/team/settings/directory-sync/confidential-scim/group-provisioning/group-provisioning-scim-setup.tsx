import { useState } from "react";
import {
  Badge,
  Card,
  Heading,
  LinkButton,
  Paragraph,
  Toggle,
  useToast,
} from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
import {
  HelpCenterArticleCta,
  ScimSetupStep,
  UserOpenHelpCenterEvent,
  UserSetupConfidentialScimEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useGroupProvisioningStatus } from "./use-group-provisioning-status";
import { logEvent } from "../../../../../libs/logs/logEvent";
const I18N_KEYS = {
  BADGE: "tac_settings_confidential_scim_group_provisioning_badge",
  STEP_1_HEADER: "tac_settings_confidential_scim_group_provisioning_header",
  STEP_1_DESCRIPTION:
    "tac_settings_confidential_scim_group_provisioning_description",
  STEP_1_SUPPORT_LINK:
    "tac_settings_confidential_scim_group_provisioning_support_link",
  STEP_2_HEADER:
    "tac_settings_confidential_scim_group_provisioning_step_2_header",
  STEP_2_DESCRIPTION:
    "tac_settings_confidential_scim_group_provisioning_step_2_description",
  TOAST_ENABLED:
    "tac_settings_confidential_scim_group_provisioning_toast_enabled",
  TOAST_DISABLED:
    "tac_settings_confidential_scim_group_provisioning_toast_disabled",
};
const I18N_ERROR_KEYS = {
  GENERIC_ERROR:
    "tac_settings_confidential_scim_group_provisioning_generic_error",
};
export const GroupProvisioningScimSetup = () => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { updateGroupProvisioningConfiguration } =
    useModuleCommands(confidentialSSOApi);
  const { groupProvisioningConfiguration } = useGroupProvisioningStatus();
  if (groupProvisioningConfiguration === null) {
    return null;
  }
  const handleOnToggle = async () => {
    setLoading(true);
    const result = await updateGroupProvisioningConfiguration({
      groupProvisioningActivated:
        !groupProvisioningConfiguration.groupProvisioningActivated ?? true,
    });
    if (result.tag === "failure") {
      showToast({
        mood: "danger",
        description: translate(I18N_ERROR_KEYS.GENERIC_ERROR),
      });
    } else {
      showToast({
        mood: "brand",
        description: translate(
          groupProvisioningConfiguration.groupProvisioningActivated
            ? I18N_KEYS.TOAST_DISABLED
            : I18N_KEYS.TOAST_ENABLED
        ),
      });
      if (!groupProvisioningConfiguration.groupProvisioningActivated) {
        logEvent(
          new UserSetupConfidentialScimEvent({
            scimSetupStep: ScimSetupStep.ActivateGroupSync,
          })
        );
      }
    }
    setLoading(false);
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        padding: "32px",
      }}
    >
      <div>
        <Badge
          mood="neutral"
          intensity="quiet"
          label={translate(I18N_KEYS.BADGE)}
          sx={{ marginBottom: "8px" }}
        />
        <Heading
          as="h2"
          textStyle="ds.title.section.medium"
          sx={{ marginBottom: "8px" }}
        >
          {translate(I18N_KEYS.STEP_1_HEADER)}
        </Heading>
        <Paragraph sx={{ marginBottom: "24px" }}>
          {translate(I18N_KEYS.STEP_1_DESCRIPTION)}
        </Paragraph>
        <LinkButton
          href="__REDACTED__"
          isExternal
          onClick={() => {
            logEvent(
              new UserOpenHelpCenterEvent({
                helpCenterArticleCta:
                  HelpCenterArticleCta.SeeGroupProvisioningSetupGuide,
              })
            );
          }}
        >
          {translate(I18N_KEYS.STEP_1_SUPPORT_LINK)}
        </LinkButton>
      </div>

      <div
        sx={{
          display: "flex",
          gap: "24px",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div>
          <Heading
            id="groupProvisioningActivation"
            as="h2"
            textStyle="ds.title.section.medium"
            sx={{ marginBottom: "8px" }}
          >
            {translate(I18N_KEYS.STEP_2_HEADER)}
          </Heading>
          <Paragraph textStyle="ds.body.standard.regular">
            {translate(I18N_KEYS.STEP_2_DESCRIPTION)}
          </Paragraph>
        </div>
        <Toggle
          aria-labelledby="groupProvisioningActivation"
          checked={
            groupProvisioningConfiguration.groupProvisioningActivated ?? false
          }
          onChange={() => handleOnToggle()}
          readOnly={loading}
        />
      </div>
    </Card>
  );
};
