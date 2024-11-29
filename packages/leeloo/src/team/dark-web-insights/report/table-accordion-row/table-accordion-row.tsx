import { useState } from "react";
import { fromUnixTime } from "date-fns";
import { Flex } from "@dashlane/design-system";
import {
  ArrowDownIcon,
  Button,
  colors,
  Notification,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/ui-components";
import {
  DarkWebInsightsBreachType,
  EmailIncidentInfo,
  EmailIncidentViewStatuses,
} from "@dashlane/communication";
import { LocalizedDateTime } from "../../../../libs/i18n/localizedDateTime";
import { LocaleFormat } from "../../../../libs/i18n/helpers";
import { TableAccordionDetailRow } from "./table-accordion-detail-row";
import useTranslate from "../../../../libs/i18n/useTranslate";
const summaryRowSx: ThemeUIStyleObject = {
  borderBottom: `1px solid ${colors.dashGreen05}`,
  height: "55px",
  position: "relative",
  borderLeft: "3px solid white",
  "&:hover,:focus-visible": {
    cursor: "pointer",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.16)",
  },
  '&[aria-expanded="true"]': {
    borderLeftColor: colors.dashGreen00,
  },
  "> td": {
    verticalAlign: "middle",
    padding: "0 16px",
  },
};
const I18N_KEYS = {
  INCIDENT_SUMMARY_INVITE_BUTTON:
    "team_dark_web_insights_incident_summary_invite_button",
  INCIDENT_SUMMARY_MEMBER: "team_dark_web_insights_incident_summary_member",
  INCIDENT_SUMMARY_PENDING: "team_dark_web_insights_incident_summary_pending",
  INCIDENT_SUMMARY_EXPAND: "team_dark_web_insights_incident_summary_expand",
  TEAM_NEW_LABEL: "team_new_label",
};
export const BREACH_DATA_TYPES_I18N_KEYS: Record<
  DarkWebInsightsBreachType,
  string
> = {
  [DarkWebInsightsBreachType.Password]:
    "team_dark_web_insights_incident_data_type_password",
  [DarkWebInsightsBreachType.CreditCard]:
    "team_dark_web_insights_incident_data_type_credit_card",
  [DarkWebInsightsBreachType.IPAddress]:
    "team_dark_web_insights_incident_data_type_ip_address",
  [DarkWebInsightsBreachType.MailingAddress]:
    "team_dark_web_insights_incident_data_type_mailing_address",
  [DarkWebInsightsBreachType.Phone]:
    "team_dark_web_insights_incident_data_type_phone",
  [DarkWebInsightsBreachType.Email]:
    "team_dark_web_insights_incident_data_type_email",
  [DarkWebInsightsBreachType.Social]:
    "team_dark_web_insights_incident_data_type_social",
  [DarkWebInsightsBreachType.GeoLocation]:
    "team_dark_web_insights_incident_data_type_geolocation",
  [DarkWebInsightsBreachType.UserName]:
    "team_dark_web_insights_incident_data_type_username",
  [DarkWebInsightsBreachType.PersonalInfo]:
    "team_dark_web_insights_incident_data_type_personalinfo",
};
interface ReportTableProps {
  shouldShowInviteButton: boolean;
  userReport: EmailIncidentInfo;
  isPendingMember?: boolean;
  onInviteAction: (email: string) => void;
}
export const TableAccordionRow = ({
  userReport,
  isPendingMember = false,
  onInviteAction,
  shouldShowInviteButton,
}: ReportTableProps) => {
  const { translate } = useTranslate();
  const [opened, setOpened] = useState(false);
  const ariaControls = userReport.leaks
    ?.map((_, index) => `${userReport.email}-${index}`)
    .join(" ");
  const affectedData = (report: EmailIncidentInfo) => {
    const data = report.leaks.map((leak) => {
      return leak.types.map((type) => {
        return translate(BREACH_DATA_TYPES_I18N_KEYS[type]);
      });
    });
    const uniqueData = [...new Set(data.flat())].join(", ");
    return uniqueData;
  };
  return (
    <>
      <tr
        id={userReport.email}
        key={userReport.email}
        tabIndex={0}
        aria-expanded={opened}
        aria-controls={ariaControls}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            setOpened((wasOpened) => !wasOpened);
          }
        }}
        onClick={() => {
          setOpened((wasOpened) => !wasOpened);
        }}
        sx={summaryRowSx}
      >
        <td>
          <Paragraph size="x-small" as="span">
            {userReport.email}
          </Paragraph>
        </td>
        <td>
          <Flex>
            <Paragraph size="medium" as="span" sx={{ fontWeight: "bold" }}>
              {userReport.breachesCount}
            </Paragraph>
            {userReport.viewStatus === EmailIncidentViewStatuses.New ? (
              <Notification
                dot
                ariaLabel={translate(I18N_KEYS.TEAM_NEW_LABEL)}
              />
            ) : null}
          </Flex>
        </td>
        <Paragraph
          size="x-small"
          as="td"
          color={colors.grey00}
          sx={{
            maxWidth: "160px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textTransform: "lowercase",
            "::first-letter": {
              textTransform: "uppercase",
            },
          }}
        >
          {affectedData(userReport)}
        </Paragraph>
        <td>
          <Paragraph size="x-small" as="span" color={colors.grey00}>
            <LocalizedDateTime
              date={fromUnixTime(userReport.leaks[0].breachDateUnix)}
              format={LocaleFormat.ll}
            />
          </Paragraph>
        </td>
        <td>
          {shouldShowInviteButton ? (
            <Button
              onClick={() => {
                onInviteAction(userReport.email);
              }}
              type="button"
              nature="secondary"
            >
              {translate(I18N_KEYS.INCIDENT_SUMMARY_INVITE_BUTTON)}
            </Button>
          ) : (
            <Paragraph size="x-small" as="span" color={colors.grey00}>
              {isPendingMember
                ? translate(I18N_KEYS.INCIDENT_SUMMARY_PENDING)
                : translate(I18N_KEYS.INCIDENT_SUMMARY_MEMBER)}
            </Paragraph>
          )}
        </td>
        <td aria-label={translate(I18N_KEYS.INCIDENT_SUMMARY_EXPAND)}>
          {
            <ArrowDownIcon
              sx={{
                transform: opened ? "scale3D(1, -1, 1)" : "scale3D(1, 1, 1)",
              }}
            />
          }
        </td>
      </tr>
      {userReport.leaks.map((leak, index, arr) => {
        const breachId = `${userReport.email}-${leak.domain}-${leak.breachDateUnix}`;
        return (
          <TableAccordionDetailRow
            id={breachId}
            key={breachId}
            breach={leak}
            opened={opened}
            isFirstInGroup={index === 0}
            isLastInGroup={index === arr.length - 1}
          />
        );
      })}
    </>
  );
};
