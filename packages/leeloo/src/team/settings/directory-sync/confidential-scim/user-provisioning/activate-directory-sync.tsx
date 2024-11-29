import { Heading, Paragraph, Toggle, useToast } from "@dashlane/design-system";
import { GridChild, GridContainer } from "@dashlane/ui-components";
import { scimApi } from "@dashlane/sso-scim-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  ScimSetupStep,
  UserSetupConfidentialScimEvent,
} from "@dashlane/hermes";
import { useEffect, useRef } from "react";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../../libs/logs/logEvent";
const I18N_KEYS = {
  HEADER: "tac_settings_confidential_scim_activate_header",
  HEADER_HELPER: "tac_settings_confidential_scim_activate_header_helper",
  ACTIVATE_AUTOMATIC_PROVISIONING:
    "tac_settings_activate_automatic_provisioning",
  DEACTIVATE_AUTOMATIC_PROVISIONING:
    "tac_settings_deactivate_automatic_provisioning",
};
interface ActivateDirectoryScimProps {
  active: boolean;
}
export const ActivateDirectoryScim = ({
  active,
}: ActivateDirectoryScimProps) => {
  const ref = useRef(false);
  const { translate } = useTranslate();
  const { updateScimConfiguration } = useModuleCommands(scimApi);
  const { showToast } = useToast();
  useEffect(() => {
    if (ref.current) {
      showToast({
        description: active
          ? translate(I18N_KEYS.ACTIVATE_AUTOMATIC_PROVISIONING)
          : translate(I18N_KEYS.DEACTIVATE_AUTOMATIC_PROVISIONING),
        closeActionLabel: "close",
      });
    }
    return () => {
      ref.current = true;
    };
  }, [active]);
  return (
    <GridContainer
      gridTemplateAreas="'title toggle' 'description toggle'"
      alignItems="center"
    >
      <GridChild
        gridArea="title"
        as={Heading}
        id="userProvisioningActivation"
        innerAs="h2"
        textStyle="ds.title.section.medium"
        sx={{ marginBottom: "8px" }}
      >
        {translate(I18N_KEYS.HEADER)}
      </GridChild>
      <GridChild
        gridArea="description"
        as={Paragraph}
        textStyle="ds.body.standard.regular"
      >
        {translate(I18N_KEYS.HEADER_HELPER)}
      </GridChild>
      <GridChild
        justifySelf="end"
        gridArea="toggle"
        as={Toggle}
        aria-labelledby="userProvisioningActivation"
        sx={{ marginLeft: "24px" }}
        onChange={() => {
          logEvent(
            new UserSetupConfidentialScimEvent({
              scimSetupStep: active
                ? ScimSetupStep.DeactivateDirectorySync
                : ScimSetupStep.ActivateDirectorySync,
            })
          );
          updateScimConfiguration({
            active: !active,
          });
        }}
        checked={active}
      />
    </GridContainer>
  );
};
