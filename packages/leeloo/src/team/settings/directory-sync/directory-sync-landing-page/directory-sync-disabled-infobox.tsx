import { Button, Infobox } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Link } from "../../../../libs/router";
import { useRouterGlobalSettingsContext } from "../../../../libs/router/RouterGlobalSettingsProvider";
const I18N_KEYS = {
  SCIM_DISABLED_CONFIDENTIAL_INCOMPATIBLE:
    "tac_settings_directory_sync_card_disabled_confidential_incompatible",
  SCIM_DISABLED_CONFIDENTIAL_NOT_ACTIVATED:
    "tac_settings_directory_sync_card_disabled_confidential_not_activated",
  SCIM_DISABLED_CONFIDENTIAL_NOT_ACTIVATED_BUTTON:
    "tac_settings_directory_sync_card_disabled_confidential_not_activated_button",
  SCIM_DISABLED_SELFHOSTED_INCOMPATIBLE:
    "tac_settings_directory_sync_card_disabled_selfhosted_incompatible",
};
interface Props {
  isNitroSSOActivated: boolean;
  isSelfhostedSSOActivated: boolean;
}
export const DirectorySyncDisabledInfobox = ({
  isNitroSSOActivated,
  isSelfhostedSSOActivated,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  return !isNitroSSOActivated && !isSelfhostedSSOActivated ? (
    <Infobox
      title={translate(I18N_KEYS.SCIM_DISABLED_CONFIDENTIAL_NOT_ACTIVATED)}
      size="large"
      actions={[
        <Button
          as={Link}
          to={routes.teamSettingsSsoConfidential}
          key="enable-confidential-sso"
          size="small"
        >
          {translate(I18N_KEYS.SCIM_DISABLED_CONFIDENTIAL_NOT_ACTIVATED_BUTTON)}
        </Button>,
      ]}
    />
  ) : (
    <Infobox
      title={
        isNitroSSOActivated
          ? translate(I18N_KEYS.SCIM_DISABLED_SELFHOSTED_INCOMPATIBLE)
          : translate(I18N_KEYS.SCIM_DISABLED_CONFIDENTIAL_INCOMPATIBLE)
      }
      size="large"
    />
  );
};
