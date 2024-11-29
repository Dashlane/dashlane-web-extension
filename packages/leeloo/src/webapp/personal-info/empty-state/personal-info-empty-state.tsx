import illustrationLight from "@dashlane/design-system/assets/illustrations/password-audits-with-activity-logs@2x-light.webp";
import illustrationDark from "@dashlane/design-system/assets/illustrations/password-audits-with-activity-logs@2x-dark.webp";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useIsUserB2B } from "../../../libs/hooks/use-is-user-b2b";
import useTranslate from "../../../libs/i18n/useTranslate";
import { EmptyStateBase } from "../../empty-state/shared/empty-state-base";
import { PersonalInfoAddDropdown } from "../personal-info-add-dropdown";
const I18N_KEYS = {
  admin: {
    title: "webapp_personal_info_empty_state_title_admin",
    description: "webapp_personal_info_empty_state_description_admin",
    nextStep: {
      add: "webapp_personal_info_empty_state_next_step_add_title",
    },
  },
  employee: {
    title: "webapp_personal_info_empty_state_title_employee",
    description: "webapp_personal_info_empty_state_description_employee",
    nextStep: {
      add: "webapp_personal_info_empty_state_next_step_add_title",
    },
  },
  b2c: {
    title: "webapp_personal_info_empty_state_title",
    description: "webapp_personal_info_empty_state_description",
    nextStep: {
      add: "webapp_personal_info_empty_state_next_step_add_title",
    },
  },
};
export const PersonalInfoEmptyState = () => {
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
      <PersonalInfoAddDropdown buttonLabel={translate(keys.nextStep.add)} />
    </EmptyStateBase>
  );
};
