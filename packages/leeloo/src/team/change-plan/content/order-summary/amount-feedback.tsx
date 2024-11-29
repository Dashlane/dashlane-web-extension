import { Flex, Icon, LinkButton, Paragraph } from "@dashlane/design-system";
import { Row } from "../../components/row";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
interface AmountFeedbackProps {
  isAmountAllowed: boolean;
  absoluteMinimum: number;
  relativeMinimum: number;
}
const I18N_KEYS = {
  LABEL: "team_account_teamplan_changeplan_order_summary_minimum_active_seats",
  MANAGE_ACTIVE_USERS:
    "team_account_teamplan_changeplan_order_summary_review_active_seats_link",
  TOOLTIP_MIN_ACTIVE_SEATS:
    "team_account_teamplan_changeplan_order_summary_minimum_active_seats_tooltip",
  TOOLTIP_MIN_ALLOWED:
    "team_account_teamplan_changeplan_order_summary_minimum_seats_absolute_tooltip",
};
export const AmountFeedback = ({
  isAmountAllowed,
  absoluteMinimum,
  relativeMinimum,
}: AmountFeedbackProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const color = isAmountAllowed
    ? "ds.text.neutral.quiet"
    : "ds.text.danger.quiet";
  const getTooltipText = () => {
    if (isAmountAllowed) {
      return translate(I18N_KEYS.TOOLTIP_MIN_ACTIVE_SEATS);
    }
    return absoluteMinimum === relativeMinimum
      ? translate(I18N_KEYS.TOOLTIP_MIN_ALLOWED, { count: absoluteMinimum })
      : translate(I18N_KEYS.TOOLTIP_MIN_ACTIVE_SEATS);
  };
  const labelText = translate(I18N_KEYS.LABEL, { count: relativeMinimum });
  return (
    <Row
      label={
        <Flex gap="5px">
          <Paragraph textStyle="ds.body.reduced.regular" color={color}>
            {labelText}
          </Paragraph>
          <Icon
            color={color}
            name="FeedbackInfoOutlined"
            size="small"
            tooltip={getTooltipText()}
          />
        </Flex>
      }
      value={
        isAmountAllowed ? (
          <LinkButton
            size="small"
            as={Link}
            to={routes.teamMembersRoutePath}
            replace
          >
            {translate(I18N_KEYS.MANAGE_ACTIVE_USERS)}
          </LinkButton>
        ) : null
      }
    />
  );
};
