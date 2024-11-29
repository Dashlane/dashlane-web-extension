import illustrationLight from "@dashlane/design-system/assets/illustrations/protect-more-than-passwords@2x-light.webp";
import illustrationDark from "@dashlane/design-system/assets/illustrations/protect-more-than-passwords@2x-dark.webp";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useIsUserB2B } from "../../../libs/hooks/use-is-user-b2b";
import { EmptyStateBase } from "../../empty-state/shared/empty-state-base";
import { NextStep } from "../../empty-state/shared/next-step";
import { redirect, useRouterGlobalSettingsContext } from "../../../libs/router";
import { logAddClick, logImportClick } from "./logs";
const I18N_KEYS = {
  admin: {
    title: "webapp_secrets_empty_state_title_admin",
    description: "webapp_secrets_empty_state_description_admin",
    nextStep: {
      add: {
        title: "webapp_secrets_empty_state_next_step_add_title_admin",
        description:
          "webapp_secrets_empty_state_next_step_add_description_admin",
        button: "webapp_secrets_empty_state_next_step_add_button_admin",
      },
      import: {
        title: "webapp_secrets_empty_state_next_step_import_title_admin",
        description:
          "webapp_secrets_empty_state_next_step_import_description_admin",
        button: "webapp_secrets_empty_state_next_step_import_button_admin",
      },
    },
  },
  employee: {
    title: "webapp_secrets_empty_state_title_employee",
    description: "webapp_secrets_empty_state_description_employee",
    nextStep: {
      add: {
        title: "webapp_secrets_empty_state_next_step_add_title_employee",
        description:
          "webapp_secrets_empty_state_next_step_add_description_employee",
        button: "webapp_secrets_empty_state_next_step_add_button_employee",
      },
      import: {
        title: "webapp_secrets_empty_state_next_step_import_title_employee",
        description:
          "webapp_secrets_empty_state_next_step_import_description_employee",
        button: "webapp_secrets_empty_state_next_step_import_button_employee",
      },
    },
  },
  b2c: {
    title: "webapp_secrets_empty_state_title",
    description: "webapp_secrets_empty_state_description",
    nextStep: {
      add: {
        title: "webapp_secrets_empty_state_next_step_add_title",
        description: "webapp_secrets_empty_state_next_step_add_description",
        button: "webapp_secrets_empty_state_next_step_add_button",
      },
      import: {
        title: "webapp_secrets_empty_state_next_step_import_title",
        description: "webapp_secrets_empty_state_next_step_import_description",
        button: "webapp_secrets_empty_state_next_step_import_button",
      },
    },
  },
};
export const SecretsEmptyState = () => {
  const { translate } = useTranslate();
  const isUserB2BResponse = useIsUserB2B();
  const { routes } = useRouterGlobalSettingsContext();
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
  const onImportClick = () => {
    logImportClick();
    redirect(routes.importData);
  };
  const onAddClick = () => {
    logAddClick();
    redirect(routes.userAddBlankSecret);
  };
  return (
    <EmptyStateBase
      title={translate(keys.title)}
      description={translate(keys.description)}
      illustrationLightSrc={illustrationLight}
      illustrationDarkSrc={illustrationDark}
    >
      <NextStep
        title={translate(keys.nextStep.import.title)}
        description={translate(keys.nextStep.import.description)}
        button={{
          children: translate(keys.nextStep.import.button),
          layout: "iconLeading",
          icon: "ImportOutlined",
          onClick: onImportClick,
        }}
      />
      <NextStep
        title={translate(keys.nextStep.add.title)}
        description={translate(keys.nextStep.add.description)}
        button={{
          children: translate(keys.nextStep.add.button),
          intensity: "quiet",
          layout: "iconLeading",
          icon: "ActionAddOutlined",
          onClick: onAddClick,
        }}
      />
    </EmptyStateBase>
  );
};
