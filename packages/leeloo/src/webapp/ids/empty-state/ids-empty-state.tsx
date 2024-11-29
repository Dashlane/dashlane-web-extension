import { DataStatus } from "@dashlane/carbon-api-consumers";
import { CurrentLocationUpdated } from "@dashlane/communication";
import illustrationLight from "@dashlane/design-system/assets/illustrations/award-winning-customer-service@2x-light.webp";
import illustrationDark from "@dashlane/design-system/assets/illustrations/award-winning-customer-service@2x-dark.webp";
import { useIsUserB2B } from "../../../libs/hooks/use-is-user-b2b";
import useTranslate from "../../../libs/i18n/useTranslate";
import { EmptyStateBase } from "../../empty-state/shared/empty-state-base";
import { IdsAddDropdown } from "../ids-add-dropdown";
import { logAddClick } from "./logs";
const I18N_KEYS = {
  admin: {
    title: "webapp_ids_empty_state_title_admin",
    description: "webapp_ids_empty_state_description_admin",
    nextStep: {
      add: "webapp_ids_empty_state_next_step_add_title",
    },
  },
  employee: {
    title: "webapp_ids_empty_state_title_employee",
    description: "webapp_ids_empty_state_description_employee",
    nextStep: {
      add: "webapp_ids_empty_state_next_step_add_title",
    },
  },
  b2c: {
    title: "webapp_ids_empty_state_title",
    description: "webapp_ids_empty_state_description",
    nextStep: {
      add: "webapp_ids_empty_state_next_step_add_title",
    },
  },
};
interface Props {
  currentLocation: CurrentLocationUpdated;
}
export const IdsEmptyState = ({ currentLocation }: Props) => {
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
  return (
    <EmptyStateBase
      title={translate(keys.title)}
      description={translate(keys.description)}
      illustrationLightSrc={illustrationLight}
      illustrationDarkSrc={illustrationDark}
    >
      <IdsAddDropdown
        currentLocation={currentLocation}
        buttonLabel={translate(keys.nextStep.add)}
        buttonClick={logAddClick}
      />
    </EmptyStateBase>
  );
};
