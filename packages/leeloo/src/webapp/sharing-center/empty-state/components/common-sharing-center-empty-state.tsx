import { DataStatus } from "@dashlane/carbon-api-consumers";
import illustrationLight from "@dashlane/design-system/assets/illustrations/create-manage-share-collections@2x-light.webp";
import illustrationDark from "@dashlane/design-system/assets/illustrations/create-manage-share-collections@2x-dark.webp";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsUserB2B } from "../../../../libs/hooks/use-is-user-b2b";
import { EmptyStateBase } from "../../../empty-state/shared/empty-state-base";
import { useHasSharableItems } from "../hooks/use-has-sharable-items";
import { SharingStep } from "../steps/sharing-step";
import { LoginsStep } from "../steps/logins-step";
const I18N_KEYS = {
  b2c: {
    title: {
      ready: "webapp_sharing_center_empty_state_title_ready",
      notReady: "webapp_sharing_center_empty_state_title_not_ready",
    },
    description: {
      ready: "webapp_sharing_center_empty_state_description_ready",
      notReady: "webapp_sharing_center_empty_state_description_not_ready",
    },
  },
  employee: {
    title: {
      ready: "webapp_sharing_center_empty_state_title_ready_employee",
      notReady: "webapp_sharing_center_empty_state_title_not_ready_employee",
    },
    description: {
      ready: "webapp_sharing_center_empty_state_description_ready_employee",
      notReady:
        "webapp_sharing_center_empty_state_description_not_ready_employee",
    },
  },
  admin: {
    title: {
      ready: "webapp_sharing_center_empty_state_title_ready_admin",
      notReady: "webapp_sharing_center_empty_state_title_not_ready_admin",
    },
    description: {
      ready: "webapp_sharing_center_empty_state_description_ready_admin",
      notReady: "webapp_sharing_center_empty_state_description_not_ready_admin",
    },
  },
};
export const CommonSharingCenterEmptyState = () => {
  const { translate } = useTranslate();
  const isUserB2BResponse = useIsUserB2B();
  const hasSharableItems = useHasSharableItems();
  if (
    hasSharableItems.status !== DataStatus.Success ||
    isUserB2BResponse.status !== DataStatus.Success
  ) {
    return null;
  }
  const isSharingReady = hasSharableItems.hasSharableItems;
  const keys =
    I18N_KEYS[
      isUserB2BResponse.isB2B
        ? isUserB2BResponse.b2bRoles.isAdmin
          ? "admin"
          : "employee"
        : "b2c"
    ];
  return (
    <EmptyStateBase
      title={translate(keys.title[isSharingReady ? "ready" : "notReady"])}
      description={translate(
        keys.description[isSharingReady ? "ready" : "notReady"]
      )}
      illustrationLightSrc={illustrationLight}
      illustrationDarkSrc={illustrationDark}
    >
      {isSharingReady ? <SharingStep /> : <LoginsStep />}
    </EmptyStateBase>
  );
};
