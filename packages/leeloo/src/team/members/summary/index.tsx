import { useEffect, useState } from "react";
import {
  Button as ButtonType,
  ClickOrigin,
  UserClickEvent,
} from "@dashlane/hermes";
import { Heading } from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  SpaceTier,
  teamAdminNotificationsApi,
  teamPasswordHealthApi,
} from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { openUrl } from "../../../libs/external-urls";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { IdPSeatsRequiredBadge } from "../../components/idp-seats-required-badge";
import SummaryCard from "./summary-card";
const I18N_KEYS = {
  TITLE: "team_members_summary_title",
  SEAT_COUNT_CONTENT: "team_members_summary_seat_count_content",
  SEAT_COUNT_CTA: "team_members_summary_seat_count_cta",
  REINVITE_USERS_CONTENT: "team_members_summary_reinvite_users_content",
  REINVITE_USERS_CTA: "team_members_summary_reinvite_users_cta",
  REINVITE_USERS_NO_NEW_INVITES_LABEL:
    "team_members_summary_reinvite_users_no_new_invites_label",
  REINVITE_USERS_NO_NEW_INVITES_CONTENT:
    "team_members_summary_reinvite_users_no_new_invites_content",
  REINVITE_USERS_NO_MEMBERS_CONTENT:
    "team_members_summary_reinvite_users_no_members_content",
  SECURITY_SCORE_CONTENT: "team_members_summary_security_score_content",
  SECURITY_SCORE_CONTENT_NO_DATA:
    "team_members_summary_security_score_content_no_data",
  SECURITY_SCORE_CTA: "team_members_summary_security_score_cta",
};
const Summary = ({
  onReinviteAllClick,
}: {
  onReinviteAllClick: () => void;
}) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const { data, status } = useModuleQuery(teamPasswordHealthApi, "getReport");
  const failedProvisionings = useModuleQuery(
    teamAdminNotificationsApi,
    "getIdPFailedProvisioningsData"
  );
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const teamTrialStatus = useTeamTrialStatus();
  const isStarterTier =
    !!teamTrialStatus && teamTrialStatus.spaceTier === SpaceTier.Starter;
  const isStandardPlan =
    !!teamTrialStatus && teamTrialStatus.spaceTier === SpaceTier.Standard;
  const [isLoading, setIsLoading] = useState(true);
  const [remainingSeats, setRemainingSeats] = useState(0);
  const [totalSeats, setTotalSeats] = useState(0);
  const [usedSeatsRatio, setUsedSeatsRatio] = useState(0);
  const [numberOfInviteNotAccepted, setNumberOfInviteNotAccepted] = useState(0);
  const [teamSecurityScore, setTeamSecurityScore] = useState(0);
  const [hasNoMembersYet, setHasNoMembersYet] = useState(true);
  const requiredSeatsForIdP =
    failedProvisionings.status === DataStatus.Success
      ? failedProvisionings.data?.requiredSeats
      : 0;
  useEffect(() => {
    if (status === "success" && shouldShowFrozenStateDialog !== null) {
      setNumberOfInviteNotAccepted(data.seats.pending);
      setRemainingSeats(data.seats.provisioned - data.seats.used);
      setTotalSeats(data.seats.provisioned);
      setUsedSeatsRatio(data.seats.used / data.seats.provisioned);
      setTeamSecurityScore(data.passwordHealth.securityIndex);
      setIsLoading(false);
      setHasNoMembersYet(data.seats.pending === 0 && data.seats.used === 1);
    }
  }, [data, status, shouldShowFrozenStateDialog]);
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        border: "1px solid ds.border.neutral.quiet.idle",
        borderRadius: "8px",
        padding: "24px",
      }}
    >
      <Heading
        as="h2"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <div
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <SummaryCard
          isLoading={isLoading}
          title={`${remainingSeats}`}
          titleColor={
            usedSeatsRatio <= 0.5
              ? "ds.text.positive.quiet"
              : usedSeatsRatio <= 0.9
              ? "ds.text.warning.quiet"
              : "ds.text.danger.quiet"
          }
          subtitle={translate(I18N_KEYS.SEAT_COUNT_CONTENT, { totalSeats })}
          action={{
            label: translate(I18N_KEYS.SEAT_COUNT_CTA),
            disabled: isLoading,
            mood: "brand",
            intensity: usedSeatsRatio > 0.5 ? "catchy" : "quiet",
            onClick: () => {
              logEvent(
                new UserClickEvent({
                  button: ButtonType.BuySeats,
                  clickOrigin: ClickOrigin.UsersSummary,
                })
              );
              if (shouldShowFrozenStateDialog) {
                openTrialDiscontinuedDialog();
              } else if (isStarterTier || isStandardPlan) {
                history.push(`${routes.teamAccountChangePlanRoutePath}`);
              } else {
                history.push(
                  `${routes.teamAccountRoutePath}?showSeatsDialog=true`
                );
              }
            },
          }}
          badge={
            requiredSeatsForIdP ? (
              <IdPSeatsRequiredBadge
                requiredSeatsForIdP={requiredSeatsForIdP}
              />
            ) : undefined
          }
        />
        <div
          sx={{ width: "1px", backgroundColor: "ds.border.neutral.quiet.idle" }}
        />
        <SummaryCard
          isLoading={isLoading}
          title={`${
            numberOfInviteNotAccepted ||
            (hasNoMembersYet
              ? "-"
              : translate(I18N_KEYS.REINVITE_USERS_NO_NEW_INVITES_LABEL))
          }`}
          titleColor={
            hasNoMembersYet
              ? "ds.text.neutral.quiet"
              : numberOfInviteNotAccepted === 0
              ? "ds.text.positive.quiet"
              : "ds.text.warning.quiet"
          }
          subtitle={
            numberOfInviteNotAccepted === 0
              ? hasNoMembersYet
                ? translate(I18N_KEYS.REINVITE_USERS_NO_MEMBERS_CONTENT)
                : translate(I18N_KEYS.REINVITE_USERS_NO_NEW_INVITES_CONTENT)
              : translate(I18N_KEYS.REINVITE_USERS_CONTENT, {
                  count: numberOfInviteNotAccepted,
                })
          }
          action={{
            label: translate(I18N_KEYS.REINVITE_USERS_CTA, {
              count: numberOfInviteNotAccepted,
            }),
            mood: "neutral",
            intensity: "quiet",
            disabled: isLoading || numberOfInviteNotAccepted === 0,
            onClick: () => {
              logEvent(
                new UserClickEvent({
                  button: ButtonType.ReInviteUsers,
                  clickOrigin: ClickOrigin.UsersSummary,
                })
              );
              if (shouldShowFrozenStateDialog) {
                openTrialDiscontinuedDialog();
              } else {
                onReinviteAllClick();
              }
            },
          }}
        />
        <div
          sx={{ width: "1px", backgroundColor: "ds.border.neutral.quiet.idle" }}
        />
        <SummaryCard
          isLoading={isLoading}
          title={`${teamSecurityScore || "-"}`}
          titleColor={
            teamSecurityScore >= 80
              ? "ds.text.positive.quiet"
              : teamSecurityScore >= 40
              ? "ds.text.warning.quiet"
              : teamSecurityScore > 0
              ? "ds.text.danger.quiet"
              : "ds.text.neutral.quiet"
          }
          subtitle={
            !teamSecurityScore || isLoading
              ? translate(I18N_KEYS.SECURITY_SCORE_CONTENT_NO_DATA)
              : translate(I18N_KEYS.SECURITY_SCORE_CONTENT)
          }
          action={{
            label: translate(I18N_KEYS.SECURITY_SCORE_CTA),
            mood: "neutral",
            intensity: "quiet",
            icon: "ActionOpenExternalLinkOutlined",
            onClick: () => {
              logEvent(
                new UserClickEvent({
                  button: ButtonType.CheckImproveHealthScore,
                  clickOrigin: ClickOrigin.UsersSummary,
                })
              );
              openUrl("__REDACTED__");
            },
          }}
        />
      </div>
    </div>
  );
};
export default Summary;
