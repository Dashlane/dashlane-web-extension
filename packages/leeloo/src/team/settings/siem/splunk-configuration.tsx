import { z } from "zod";
import {
  Button,
  Card,
  Heading,
  Infobox,
  Paragraph,
  PasswordField,
  TextField,
  Toggle,
  useToast,
} from "@dashlane/design-system";
import { useEffect, useRef, useState } from "react";
import {
  useAnalyticsCommands,
  useModuleCommands,
} from "@dashlane/framework-react";
import { SsoSolution } from "@dashlane/sso-scim-contracts";
import { teamEnclaveApi } from "@dashlane/enclave-contracts";
import {
  SetSiemConfigurationError,
  SetSiemConfigurationErrorCode,
  siemApi,
} from "@dashlane/risk-monitoring-contracts";
import {
  PageView,
  SplunkSetupStep,
  UserSetupSplunkIntegrationEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { SplunkSelfSignedCertificate } from "./splunk-self-signed-certificate";
const I18N_KEYS = {
  SPLUNK_UNAVAILABLE_INFOBOX_TITLE:
    "team_settings_splunk_configuration_splunk_unavailable_infobox_title",
  SPLUNK_STEP_1_TITLE: "team_settings_splunk_configuration_step_1_title",
  SPLUNK_STEP_1_DESCRIPTION:
    "team_settings_splunk_configuration_step_1_description",
  SPLUNK_STEP_1_INFOBOX: "team_settings_splunk_configuration_step_1_infobox",
  SPLUNK_STEP_2_TITLE: "team_settings_splunk_configuration_step_2_title",
  SPLUNK_STEP_2_DESCRIPTION:
    "team_settings_splunk_configuration_step_2_description",
  SPLUNK_FIELD_INSTANCE_URL_LABEL:
    "team_settings_splunk_configuration_instance_url_label",
  SPLUNK_FIELD_TOKEN_LABEL: "team_settings_splunk_configuration_token_label",
  SPLUNK_INTEGRATION_SAVED_TOAST:
    "team_settings_splunk_integration_saved_toast",
  ACTIONS_SAVE: "team_settings_siem_configuration_actions_save",
  ACTIONS_UPDATE: "team_settings_siem_configuration_actions_update",
  SPLUNK_STEP_3_TITLE: "team_settings_splunk_configuration_step_3_title",
  SPLUNK_STEP_3_DESCRIPTION:
    "team_settings_splunk_configuration_step_3_description",
  SPLUNK_INTEGRATION_ACTIVATED_TOAST:
    "team_settings_splunk_integration_activated_toast",
  SPLUNK_INTEGRATION_DEACTIVATED_TOAST:
    "team_settings_splunk_integration_deactivated_toast",
  HIDE: "_common_password_hide_label",
  SHOW: "_common_password_show_label",
};
const I18N_ERROR_KEYS = {
  INVALID_URL: "team_settings_set_siem_configuration_invalid_url",
  GENERIC_ERROR: "team_settings_set_siem_configuration_generic_error",
  TEAM_NOT_FOUND: "team_settings_set_siem_configuration_team_not_found",
  MISMATCHING_ADMIN_PROVISIONING_KEY:
    "team_settings_set_siem_configuration_mismatching_admin_provision_key",
  NO_SIEM_CONFIGURATION_UPDATE:
    "team_settings_set_siem_configuration_no_siem_configuration_update",
};
interface SplunkConfigurationProps {
  token: string;
  instanceURL: string;
  isSelfSignedCertificateAllowed: boolean;
  active: boolean;
  isTeamAlreadyCreated: boolean | null;
  hasSiemPaywall: boolean;
  hasSelfSignedCertFF: boolean;
  ssoSolution: z.infer<typeof SsoSolution>;
}
export const SplunkConfiguration = ({
  token,
  instanceURL,
  isSelfSignedCertificateAllowed,
  active,
  isTeamAlreadyCreated,
  hasSiemPaywall,
  hasSelfSignedCertFF,
  ssoSolution,
}: SplunkConfigurationProps) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { trackPageView } = useAnalyticsCommands();
  const { setSiemConfiguration } = useModuleCommands(siemApi);
  const { createTeamInEnclave } = useModuleCommands(teamEnclaveApi);
  const tokenFieldRef = useRef<HTMLInputElement>(null);
  const instanceURLFieldRef = useRef<HTMLInputElement>(null);
  const isSelfSignedCertificateAllowedRef = useRef(
    isSelfSignedCertificateAllowed
  );
  const [formIsUpdated, setFormIsUpdated] = useState(false);
  const [instanceURLError, setInstanceURLError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const isFilled = token && instanceURL;
  const isSiemSupported =
    ssoSolution === SsoSolution.enum.none ||
    ssoSolution === SsoSolution.enum.confidentialSaml;
  const isSiemAvailable = !hasSiemPaywall && isSiemSupported;
  useEffect(() => {
    void trackPageView({
      pageView: PageView.TacIntegrationsSplunk,
    });
  }, []);
  const onFieldChange = (field: "token" | "instanceURL" | "selfSignedCert") => {
    if (
      token !== tokenFieldRef.current?.value ||
      instanceURL !== instanceURLFieldRef.current?.value ||
      isSelfSignedCertificateAllowed !==
        isSelfSignedCertificateAllowedRef.current
    ) {
      setFormIsUpdated(true);
    } else {
      setFormIsUpdated(false);
    }
    if (field === "instanceURL") {
      setInstanceURLError("");
    }
  };
  const handleError = (error: SetSiemConfigurationError) => {
    if (error.tag === SetSiemConfigurationErrorCode.INVALID_URL) {
      setInstanceURLError(translate(I18N_ERROR_KEYS.INVALID_URL));
      logEvent(
        new UserSetupSplunkIntegrationEvent({
          splunkSetupStep: SplunkSetupStep.InvalidUrlError,
        })
      );
    } else {
      showToast({
        mood: "danger",
        description: translate(
          error.tag in I18N_ERROR_KEYS
            ? I18N_ERROR_KEYS[error.tag as keyof typeof I18N_ERROR_KEYS]
            : I18N_ERROR_KEYS.GENERIC_ERROR
        ),
      });
      logEvent(
        new UserSetupSplunkIntegrationEvent({
          splunkSetupStep:
            error.tag === "MISMATCHING_ADMIN_PROVISIONING_KEY"
              ? SplunkSetupStep.MismatchAdminProvisioningKeyError
              : error.tag === "TEAM_NOT_FOUND"
              ? SplunkSetupStep.TeamNotFoundError
              : SplunkSetupStep.GenericError,
        })
      );
    }
  };
  const handleOnToggle = async (value: boolean) => {
    setToggleLoading(true);
    const result = await setSiemConfiguration({
      active: value,
    });
    if (result.tag === "failure") {
      handleError(result.error);
    } else {
      showToast({
        mood: "brand",
        description: value
          ? translate(I18N_KEYS.SPLUNK_INTEGRATION_ACTIVATED_TOAST)
          : translate(I18N_KEYS.SPLUNK_INTEGRATION_DEACTIVATED_TOAST),
      });
      logEvent(
        new UserSetupSplunkIntegrationEvent({
          splunkSetupStep: value
            ? SplunkSetupStep.ActivateSplunkIntegration
            : SplunkSetupStep.DeactivateSplunkIntegration,
        })
      );
    }
    setToggleLoading(false);
  };
  const handleOnSave = async () => {
    setFormLoading(true);
    if (!isTeamAlreadyCreated) {
      await createTeamInEnclave();
    }
    const configurationIsIncomplete =
      !tokenFieldRef?.current?.value || !instanceURLFieldRef?.current?.value;
    const result = await setSiemConfiguration({
      token: tokenFieldRef?.current?.value.trim(),
      instanceURL: instanceURLFieldRef?.current?.value.trim(),
      active: configurationIsIncomplete ? false : undefined,
      isSelfSignedCertificateAllowed: isSelfSignedCertificateAllowedRef.current,
    });
    if (result.tag === "failure") {
      handleError(result.error);
    } else {
      showToast({
        mood: "brand",
        description: translate(I18N_KEYS.SPLUNK_INTEGRATION_SAVED_TOAST),
      });
      logEvent(
        new UserSetupSplunkIntegrationEvent({
          splunkSetupStep: SplunkSetupStep.SaveTokens,
        })
      );
      setFormIsUpdated(false);
    }
    setFormLoading(false);
  };
  return (
    <>
      {!isSiemSupported ? (
        <Infobox
          mood="danger"
          title={translate(I18N_KEYS.SPLUNK_UNAVAILABLE_INFOBOX_TITLE)}
          sx={{ marginBottom: "24px" }}
        />
      ) : null}
      <Card sx={{ marginBottom: "24px" }}>
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            opacity: isSiemAvailable ? "1" : "0.5",
          }}
        >
          <div>
            <Heading as="h2" sx={{ marginBottom: "8px" }}>
              {translate(I18N_KEYS.SPLUNK_STEP_1_TITLE)}
            </Heading>
            <Paragraph sx={{ marginBottom: "16px" }}>
              {translate(I18N_KEYS.SPLUNK_STEP_1_DESCRIPTION)}
            </Paragraph>
            {!hasSiemPaywall ? (
              <Infobox
                mood={!isSiemSupported ? "neutral" : "brand"}
                title={translate(I18N_KEYS.SPLUNK_STEP_1_INFOBOX)}
              />
            ) : null}
          </div>

          <div>
            <Heading as="h2" sx={{ marginBottom: "8px" }}>
              {translate(I18N_KEYS.SPLUNK_STEP_2_TITLE)}
            </Heading>
            <Paragraph sx={{ marginBottom: "24px" }}>
              {translate(I18N_KEYS.SPLUNK_STEP_2_DESCRIPTION)}
            </Paragraph>
            <div sx={{ display: "flex", gap: "16px", flexDirection: "column" }}>
              <TextField
                value={instanceURL}
                label={translate(I18N_KEYS.SPLUNK_FIELD_INSTANCE_URL_LABEL)}
                ref={instanceURLFieldRef}
                onChange={() => onFieldChange("instanceURL")}
                id="splunk-instance-url-field"
                disabled={!isSiemAvailable}
                error={!!instanceURLError}
                feedback={instanceURLError ? instanceURLError : undefined}
              />
              <PasswordField
                value={token}
                label={translate(I18N_KEYS.SPLUNK_FIELD_TOKEN_LABEL)}
                ref={tokenFieldRef}
                onChange={() => onFieldChange("token")}
                disabled={!isSiemAvailable}
                data-testid="splunk-token-field"
                toggleVisibilityLabel={{
                  show: translate(I18N_KEYS.SHOW),
                  hide: translate(I18N_KEYS.HIDE),
                }}
              />
            </div>
          </div>

          {hasSelfSignedCertFF ? (
            <SplunkSelfSignedCertificate
              defaultValue={isSelfSignedCertificateAllowed}
              onChange={(ev) => {
                isSelfSignedCertificateAllowedRef.current = ev.target.checked;
                onFieldChange("selfSignedCert");
              }}
              disabled={!isSiemAvailable}
            />
          ) : null}

          <div
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              intensity="catchy"
              disabled={!formIsUpdated || !isSiemAvailable}
              onClick={handleOnSave}
              isLoading={formLoading}
            >
              {isFilled
                ? translate(I18N_KEYS.ACTIONS_UPDATE)
                : translate(I18N_KEYS.ACTIONS_SAVE)}
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div
          sx={{
            display: "flex",
            gap: "32px",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: isSiemAvailable ? "1" : "0.5",
          }}
        >
          <div>
            <Heading as="h2" sx={{ marginBottom: "8px" }}>
              {translate(I18N_KEYS.SPLUNK_STEP_3_TITLE)}
            </Heading>
            <Paragraph>
              {translate(I18N_KEYS.SPLUNK_STEP_3_DESCRIPTION)}
            </Paragraph>
          </div>
          <div>
            <Toggle
              aria-label="activateSiemToggle"
              onChange={() => handleOnToggle(!active)}
              checked={active}
              disabled={!isFilled || toggleLoading || !isSiemAvailable}
            />
          </div>
        </div>
      </Card>
    </>
  );
};
