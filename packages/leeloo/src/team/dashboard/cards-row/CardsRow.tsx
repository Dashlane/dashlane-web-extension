import { PropsWithChildren } from "react";
import { InfoCircleIcon, Tooltip } from "@dashlane/ui-components";
import {
  Card,
  DSStyleObject,
  Heading,
  Paragraph,
} from "@dashlane/design-system";
import {
  PasswordHealth,
  Seats,
  SpaceTier,
  teamAdminNotificationsApi,
} from "@dashlane/team-admin-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import { Link } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { IdPSeatsRequiredBadge } from "../../components/idp-seats-required-badge";
import { PasswordHealthScore } from "../password-health-score/PasswordHealthScore";
import styles from "./styles.css";
const SX_STYLES: Record<string, DSStyleObject> = {
  HEADER: {
    display: "flex",
  },
  FOOTER: {
    lineHeight: "1",
    fontSize: "16px",
  },
  MAIN_CARD_CONTENT: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
};
const I18N_KEYS = {
  CARD_COMPROMISED: "team_dashboard_card_compromised",
  CARD_COMPROMISED_DETAILS_LINK: "team_dashboard_card_compromised_details_link",
  CARD_COMPROMISED_INFO: "team_dashboard_card_compromised_info",
  CARD_HEALTH_SCORE: "team_dashboard_card_health_score",
  CARD_HEALTH_SCORE_INFO: "team_dashboard_card_health_score_info",
  CARD_PENDING_INVITATIONS: "team_dashboard_card_pending_invitations",
  CARD_PENDING_INVITATIONS_INFO: "team_dashboard_card_pending_invitations_info",
  CARD_SEND_INVITATIONS_LINK: "team_dashboard_card_send_invitations_link",
  CARD_RESEND_INVITATIONS_LINK: "team_dashboard_card_resend_invitations_link",
  CARD_SEATS_BUY_LINK: "team_dashboard_card_seats_buy_link",
  CARD_SEATS_TAKEN: "team_dashboard_card_seats_taken",
  CARD_SEATS_TAKEN_INFO: "team_dashboard_card_seats_taken_info",
};
const InfoIconWithTooltip = ({ title }: Record<"title", string>) => (
  <Tooltip
    sx={{ fontSize: 2, maxWidth: "180px" }}
    placement="bottom"
    content={title}
  >
    <InfoCircleIcon size={13} tabIndex={0} color={"ds.text.neutral.quiet"} />
  </Tooltip>
);
const cardHeading = (heading: string) => {
  return (
    <Heading
      as="h1"
      color="ds.text.neutral.quiet"
      textStyle="ds.title.supporting.small"
    >
      {heading}
    </Heading>
  );
};
const CardsRowCard = ({
  children,
}: PropsWithChildren<Record<never, never>>) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "146px",
        width: "232px",
        padding: "16px",
        marginRight: "32px",
        flexShrink: "0",
        overflow: "inherit",
        color: "ds.text.neutral.catchy",
      }}
    >
      {children}
    </Card>
  );
};
interface CardsRowProps {
  passwordHealth: PasswordHealth;
  seats: Seats;
  passwordHealthHistoryEmpty: boolean;
}
export const CardsRow = ({
  passwordHealth,
  seats,
  passwordHealthHistoryEmpty,
}: CardsRowProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const { compromised, securityIndex } = passwordHealth;
  const seatsTaken = `${seats.used}/${seats.provisioned}`;
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const failedProvisionings = useModuleQuery(
    teamAdminNotificationsApi,
    "getIdPFailedProvisioningsData"
  );
  const requiredSeatsForIdP =
    failedProvisionings.status === DataStatus.Success
      ? failedProvisionings.data?.requiredSeats
      : 0;
  const teamTrialStatus = useTeamTrialStatus();
  const isStarterTier =
    !!teamTrialStatus && teamTrialStatus.spaceTier === SpaceTier.Starter;
  const isStandardPlan =
    !!teamTrialStatus && teamTrialStatus.spaceTier === SpaceTier.Standard;
  const handleClickOnLink = () => {
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
    }
  };
  return (
    <section
      className={styles.cardsRow}
      sx={{
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <CardsRowCard>
        <div sx={SX_STYLES.MAIN_CARD_CONTENT}>
          <header sx={SX_STYLES.HEADER}>
            {cardHeading(translate(I18N_KEYS.CARD_HEALTH_SCORE))}
            <InfoIconWithTooltip
              title={translate(I18N_KEYS.CARD_HEALTH_SCORE_INFO)}
            />
          </header>
          <div sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <PasswordHealthScore
              showPasswordHealthScore={!passwordHealthHistoryEmpty}
              securityIndex={securityIndex}
              shieldSize={"xlarge"}
              textSize={"medium"}
            />
          </div>
        </div>
      </CardsRowCard>

      <CardsRowCard>
        <div sx={SX_STYLES.MAIN_CARD_CONTENT}>
          <header sx={SX_STYLES.HEADER}>
            {cardHeading(translate(I18N_KEYS.CARD_COMPROMISED))}
            <InfoIconWithTooltip
              title={translate(I18N_KEYS.CARD_COMPROMISED_INFO)}
            />
          </header>
          <Paragraph
            textStyle="ds.specialty.spotlight.medium"
            color={
              compromised ? "ds.text.danger.quiet" : "ds.text.neutral.catchy"
            }
          >
            {compromised}
          </Paragraph>
        </div>
        {compromised ? (
          <footer sx={SX_STYLES.FOOTER}>
            <Link className={styles.link} to={routes.teamMembersRoutePath}>
              {translate(I18N_KEYS.CARD_COMPROMISED_DETAILS_LINK)}
            </Link>
          </footer>
        ) : null}
      </CardsRowCard>

      <CardsRowCard>
        <div sx={SX_STYLES.MAIN_CARD_CONTENT}>
          <header sx={SX_STYLES.HEADER}>
            {cardHeading(translate(I18N_KEYS.CARD_SEATS_TAKEN))}
            <InfoIconWithTooltip
              title={translate(I18N_KEYS.CARD_SEATS_TAKEN_INFO)}
            />
          </header>
          <Paragraph
            textStyle={
              seatsTaken.length > 10
                ? "ds.specialty.spotlight.small"
                : "ds.specialty.spotlight.medium"
            }
            color="ds.text.neutral.catchy"
          >
            {seatsTaken}
          </Paragraph>
          {requiredSeatsForIdP ? (
            <IdPSeatsRequiredBadge requiredSeatsForIdP={requiredSeatsForIdP} />
          ) : null}
        </div>
        <footer sx={SX_STYLES.FOOTER}>
          <Link
            className={styles.link}
            to={
              isStarterTier || isStandardPlan
                ? `${routes.teamAccountChangePlanRoutePath}`
                : !shouldShowFrozenStateDialog
                ? `${routes.teamAccountRoutePath}?showSeatsDialog=true`
                : {}
            }
            onClick={handleClickOnLink}
          >
            {translate(I18N_KEYS.CARD_SEATS_BUY_LINK)}
          </Link>
        </footer>
      </CardsRowCard>

      <CardsRowCard>
        <div sx={SX_STYLES.MAIN_CARD_CONTENT}>
          <header sx={SX_STYLES.HEADER}>
            {cardHeading(translate(I18N_KEYS.CARD_PENDING_INVITATIONS))}
            <InfoIconWithTooltip
              title={translate(I18N_KEYS.CARD_PENDING_INVITATIONS_INFO)}
            />
          </header>
          <Paragraph
            textStyle="ds.specialty.spotlight.medium"
            color="ds.text.neutral.catchy"
          >
            {seats.pending}
          </Paragraph>
        </div>
        <footer sx={SX_STYLES.FOOTER}>
          <Link
            onClick={handleClickOnLink}
            className={styles.link}
            to={
              !shouldShowFrozenStateDialog
                ? {
                    pathname: routes.teamMembersRoutePath,
                    state: seats.pending
                      ? {
                          openResendPendingInvitationsDialog: true,
                        }
                      : {
                          openSendInvitesDialog: true,
                        },
                  }
                : {}
            }
          >
            {seats.pending
              ? translate(I18N_KEYS.CARD_RESEND_INVITATIONS_LINK)
              : translate(I18N_KEYS.CARD_SEND_INVITATIONS_LINK)}
          </Link>
        </footer>
      </CardsRowCard>
    </section>
  );
};
