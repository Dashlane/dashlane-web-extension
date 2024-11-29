import { Icon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { GuideItemIcon } from "./guide-item-icon";
import { GuideItemAction } from "./guide-item-action";
import { GuideItemMessage } from "./guide-item-message";
import { GuideItemComponentProps } from "../../types/section.types";
import { TaskStatus } from "../../types/item.types";
const I18N_KEYS = { TASK_COMPLETED: "onb_vault_get_started_task_completed" };
export const GuideItemComponent = ({
  icon,
  title,
  action,
  status,
}: GuideItemComponentProps) => {
  const { translate } = useTranslate();
  return (
    <li
      sx={{
        padding: "16px 0",
        borderBottom: "1px solid ds.border.neutral.quiet.idle",
        "&:first-of-type": {
          paddingTop: "0",
        },
        "&:last-of-type": {
          paddingBottom: "0",
          borderBottom: "none",
        },
      }}
    >
      <div
        sx={{
          display: "grid",
          gridTemplateColumns: "40px 1fr auto",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <GuideItemIcon icon={icon} status={status} />

        <GuideItemMessage title={title} />

        {status !== TaskStatus.COMPLETED ? (
          action ? (
            <GuideItemAction action={action} status={status} />
          ) : null
        ) : (
          <Paragraph
            textStyle="ds.title.block.small"
            color="ds.text.positive.quiet"
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <span>{translate(I18N_KEYS.TASK_COMPLETED)}</span>
            <Icon
              name="FeedbackSuccessOutlined"
              color="ds.text.positive.quiet"
            />
          </Paragraph>
        )}
      </div>
    </li>
  );
};
