import { Badge, Card, Flex } from "@dashlane/design-system";
import {
  ScimConfigurationQuerySuccess,
  ScimEndpointQuerySuccess,
} from "@dashlane/sso-scim-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { GenerateToken } from "./generate-token";
import { CopyToken } from "./copy-token";
import { ActivateDirectoryScim } from "./activate-directory-sync";
const I18N_KEYS = {
  BADGE: "tac_settings_confidential_scim_user_provisioning_badge",
};
interface Props {
  scimEndpoint?: ScimEndpointQuerySuccess;
  scimConfiguration: ScimConfigurationQuerySuccess;
}
export const UserProvisioningScimSetup = ({
  scimEndpoint,
  scimConfiguration,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <Flex gap="32px" flexDirection="column" as={Card} sx={{ padding: "32px" }}>
      <Badge
        mood="neutral"
        intensity="quiet"
        label={translate(I18N_KEYS.BADGE)}
        sx={{ marginBottom: "calc(8px - 32px)" }}
      />

      <div>
        <GenerateToken isTokenGenerated={!!scimConfiguration.token} />
      </div>
      <div>
        <CopyToken
          scimEndpoint={scimEndpoint?.endpoint}
          scimApiToken={scimConfiguration.token}
        />
      </div>
      <div>
        <ActivateDirectoryScim active={scimConfiguration.active} />
      </div>
    </Flex>
  );
};
