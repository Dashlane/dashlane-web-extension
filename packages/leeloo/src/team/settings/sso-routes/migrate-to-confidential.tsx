import { useRef, useState } from "react";
import { useModuleCommands } from "@dashlane/framework-react";
import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
import { Button, TextField, useToast } from "@dashlane/design-system";
import { GridContainer } from "@dashlane/ui-components";
import { isFailure, match } from "@dashlane/framework-types";
import { MinimalCard } from "../components/layout/minimal-card";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_VALUES = {
  MIGRATE_TO_CONFIDENTIAL: "migrate_to_confidential_sso_migrate_button_label",
  MIGRATE_TO_CONFIDENTIAL_INPUT_LABEL:
    "migrate_to_confidential_sso_input_label",
  MIGRATE_TO_CONFIDENTIAL_SUCCESS: "migrate_to_confidential_sso_success",
  MIGRATE_TO_CONFIDENTIAL_ERROR: "migrate_to_confidential_sso_error",
  MIGRATE_TO_CONFIDENTIAL_SSO_CONNECTOR_KEY_MISSING:
    "migrate_to_confidential_sso_connector_key_missing",
  MIGRATE_TO_CONFIDENTIAL_SSO_CONNECTOR_KEY_FORMAT_INVALID:
    "migrate_to_confidential_sso_connector_key_format_invalid",
};
export const MigrateToConfidential = ({
  isSsoConnector,
}: {
  isSsoConnector: boolean;
}) => {
  const { translate } = useTranslate();
  const [isMigrating, setIsMigrating] = useState(false);
  const { migrateToConfidentialSso } = useModuleCommands(confidentialSSOApi);
  const { showToast } = useToast();
  const ssoConnectorKeyRef = useRef<HTMLInputElement>(null);
  return (
    <GridContainer
      as={MinimalCard}
      backgroundColor="ds.background.default"
      paddingSize="normal"
      gridTemplateRows="auto 1fr auto"
      justifyItems="center"
      gap="8px"
    >
      {isSsoConnector ? (
        <TextField
          ref={ssoConnectorKeyRef}
          label={translate(I18N_VALUES.MIGRATE_TO_CONFIDENTIAL_INPUT_LABEL)}
          sx={{ width: "400px" }}
        />
      ) : null}

      <Button
        layout="iconLeading"
        icon="ToolsOutlined"
        isLoading={isMigrating}
        onClick={async () => {
          try {
            setIsMigrating(true);
            const result = await migrateToConfidentialSso({
              ssoConnectorKey: ssoConnectorKeyRef.current?.value.trim(),
            });
            if (isFailure(result)) {
              const errorTranslation = match(result.error, {
                SSO_CONNECTOR_KEY_MISSING: () => {
                  return translate(
                    I18N_VALUES.MIGRATE_TO_CONFIDENTIAL_SSO_CONNECTOR_KEY_MISSING
                  );
                },
                SSO_CONNECTOR_KEY_FORMAT_INVALID: () => {
                  return translate(
                    I18N_VALUES.MIGRATE_TO_CONFIDENTIAL_SSO_CONNECTOR_KEY_FORMAT_INVALID
                  );
                },
              });
              showToast({
                description: errorTranslation,
                closeActionLabel: translate("_common_toast_close_label"),
                mood: "danger",
              });
            } else {
              showToast({
                description: translate(
                  I18N_VALUES.MIGRATE_TO_CONFIDENTIAL_SUCCESS
                ),
                closeActionLabel: translate("_common_toast_close_label"),
              });
            }
          } catch {
            showToast({
              description: translate(I18N_VALUES.MIGRATE_TO_CONFIDENTIAL_ERROR),
              closeActionLabel: translate("_common_toast_close_label"),
              mood: "danger",
            });
          } finally {
            setIsMigrating(false);
          }
        }}
      >
        {translate(I18N_VALUES.MIGRATE_TO_CONFIDENTIAL)}
      </Button>
    </GridContainer>
  );
};
