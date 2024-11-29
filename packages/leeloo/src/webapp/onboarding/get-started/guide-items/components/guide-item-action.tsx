import { Button, LinkButton, Paragraph } from "@dashlane/design-system";
import {
  Link,
  useRouterGlobalSettingsContext,
} from "../../../../../libs/router";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { ActionType, TaskStatus } from "../../types/item.types";
import { Action } from "../../types/action.types";
const I18N_KEYS = { INSTALL_EXTENSION: "onb_vault_get_started_task_disabled" };
export const GuideItemAction = ({
  status,
  action,
}: {
  status: TaskStatus;
  action: Action;
}) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  if (action.type === ActionType.LINK) {
    return (
      <LinkButton
        as={Link}
        to={routes[action.href]}
        size="small"
        onClick={action.handler}
      >
        {translate(action.label)}
      </LinkButton>
    );
  }
  return status === TaskStatus.IDLE ? (
    <Button
      mood="brand"
      size="small"
      intensity="quiet"
      icon={action.icon}
      layout={action.layout}
      onClick={action.handler}
    >
      {translate(action.label)}
    </Button>
  ) : (
    <Paragraph
      textStyle="ds.body.reduced.regular"
      color="ds.text.neutral.quiet"
    >
      {translate(I18N_KEYS.INSTALL_EXTENSION)}
    </Paragraph>
  );
};
