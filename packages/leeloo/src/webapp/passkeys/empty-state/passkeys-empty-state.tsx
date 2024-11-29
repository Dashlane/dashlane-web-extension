import illustrationLight from "@dashlane/design-system/assets/illustrations/passkeys-faster-easier-more-secure@2x-light.webp";
import illustrationDark from "@dashlane/design-system/assets/illustrations/passkeys-faster-easier-more-secure@2x-dark.webp";
import { Button } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useIsUserB2B } from "../../../libs/hooks/use-is-user-b2b";
import useTranslate from "../../../libs/i18n/useTranslate";
import { openUrl } from "../../../libs/external-urls";
import { EmptyStateBase } from "../../empty-state/shared/empty-state-base";
import { DASHLANE_PASSKEYS_DIRECTORY } from "../../urls";
import { logCheckSupportedDevicesClick } from "./logs";
const I18N_KEYS = {
  admin: {
    title: "webapp_passkeys_empty_state_title_admin",
    description: "webapp_passkeys_empty_state_description_admin",
    nextStep: {
      directory: "webapp_passkeys_empty_state_next_step_directory_title",
    },
  },
  employee: {
    title: "webapp_passkeys_empty_state_title_employee",
    description: "webapp_passkeys_empty_state_description_employee",
    nextStep: {
      directory: "webapp_passkeys_empty_state_next_step_directory_title",
    },
  },
  b2c: {
    title: "webapp_passkeys_empty_state_title",
    description: "webapp_passkeys_empty_state_description",
    nextStep: {
      directory: "webapp_passkeys_empty_state_next_step_directory_title",
    },
  },
};
export const PasskeysEmptyState = () => {
  const { translate } = useTranslate();
  const isUserB2BResponse = useIsUserB2B();
  if (isUserB2BResponse.status !== DataStatus.Success) {
    return null;
  }
  const keys =
    I18N_KEYS[
      isUserB2BResponse.isB2B
        ? isUserB2BResponse.b2bRoles.isAdmin
          ? "admin"
          : "employee"
        : "b2c"
    ];
  const onDirectoryClick = () => {
    logCheckSupportedDevicesClick();
    openUrl(DASHLANE_PASSKEYS_DIRECTORY);
  };
  return (
    <EmptyStateBase
      title={translate(keys.title)}
      description={translate(keys.description)}
      illustrationLightSrc={illustrationLight}
      illustrationDarkSrc={illustrationDark}
    >
      <Button
        mood="brand"
        intensity="quiet"
        layout="iconTrailing"
        icon="ActionOpenExternalLinkOutlined"
        onClick={onDirectoryClick}
      >
        {translate(keys.nextStep.directory)}
      </Button>
    </EmptyStateBase>
  );
};
