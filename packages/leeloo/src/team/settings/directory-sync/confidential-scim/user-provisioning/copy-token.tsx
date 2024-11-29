import {
  Heading,
  Paragraph,
  PasswordField,
  TextField,
} from "@dashlane/design-system";
import {
  ScimSetupStep,
  UserSetupConfidentialScimEvent,
} from "@dashlane/hermes";
import { useState } from "react";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../../libs/logs/logEvent";
const I18N_KEYS = {
  HEADER: "tac_settings_confidential_scim_copy_token_header",
  HEADER_HELPER: "tac_settings_confidential_scim_copy_token_header_helper",
  TOKEN_LABEL: "tac_settings_confidential_scim_copy_token_field_token_label",
  ENDPOINT_LABEL:
    "tac_settings_confidential_scim_copy_token_field_endpoint_label",
  HIDE: "_common_password_hide_label",
  SHOW: "_common_password_show_label",
  COPY: "input_copy_button",
  COPIED: "input_copied_button_feedback",
};
interface CopyTokenProps {
  scimApiToken?: string | null;
  scimEndpoint?: string | null;
}
export const CopyToken = ({ scimApiToken, scimEndpoint }: CopyTokenProps) => {
  const { translate } = useTranslate();
  const [tokenIsCopied, setTokenIsCopied] = useState(false);
  const [endpointIsCopied, setEndpointIsCopied] = useState(false);
  const onCopyValue = async (name: "token" | "endpoint", value?: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    if (name === "token") {
      setTokenIsCopied(true);
      setTimeout(() => setTokenIsCopied(false), 2000);
    } else {
      setEndpointIsCopied(true);
      setTimeout(() => setEndpointIsCopied(false), 2000);
    }
  };
  return (
    <>
      <Heading
        as="h2"
        textStyle="ds.title.section.medium"
        sx={{ marginBottom: "8px" }}
      >
        {translate(I18N_KEYS.HEADER)}
      </Heading>
      <Paragraph
        textStyle="ds.body.standard.regular"
        sx={{ marginBottom: "24px" }}
      >
        {translate(I18N_KEYS.HEADER_HELPER)}
      </Paragraph>
      <PasswordField
        label={translate(I18N_KEYS.TOKEN_LABEL)}
        value={scimApiToken ?? ""}
        disabled={!scimApiToken}
        readOnly={!!scimApiToken}
        toggleVisibilityLabel={{
          hide: translate(I18N_KEYS.HIDE),
          show: translate(I18N_KEYS.SHOW),
        }}
        sx={{ marginBottom: "16px" }}
        actions={[
          {
            iconName: "ActionCopyOutlined",
            label: tokenIsCopied
              ? translate(I18N_KEYS.COPIED)
              : translate(I18N_KEYS.COPY),
            key: "copy-token",
            onClick: async () => {
              await onCopyValue("token", scimApiToken ?? "");
              logEvent(
                new UserSetupConfidentialScimEvent({
                  scimSetupStep: ScimSetupStep.CopyApiToken,
                })
              );
            },
          },
        ]}
      />
      <TextField
        value={scimEndpoint ?? ""}
        label={translate(I18N_KEYS.ENDPOINT_LABEL)}
        disabled={!scimEndpoint}
        readOnly={!!scimEndpoint}
        actions={[
          {
            iconName: "ActionCopyOutlined",
            key: "copy-endpoint",
            label: endpointIsCopied
              ? translate(I18N_KEYS.COPIED)
              : translate(I18N_KEYS.COPY),
            onClick: async () => {
              logEvent(
                new UserSetupConfidentialScimEvent({
                  scimSetupStep: ScimSetupStep.CopyEndpointLink,
                })
              );
              await onCopyValue("endpoint", scimEndpoint ?? "");
            },
          },
        ]}
      />
    </>
  );
};
