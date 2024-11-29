import { useEffect } from "react";
import { fromUnixTime } from "date-fns";
import { PageView } from "@dashlane/hermes";
import { Dialog, Paragraph } from "@dashlane/design-system";
import { SpaceTier, teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import useTranslate from "../../i18n/useTranslate";
import { LocaleFormat } from "../../i18n/helpers";
import { logPageView } from "../../logs/logEvent";
const I18N_KEYS = {
  CLOSE_BUTTON: "_common_dialog_dismiss_button",
  TITLE: "team_trial_extended_dialog_title",
  DAYS_LEFT_SUBTITLE_BUSINESS: "team_trial_extended_dialog_days_left",
  DAYS_LEFT_SUBTITLE_TEAM: "team_trial_extended_dialog_days_left_team_plan",
  DESCRIPTION: "team_trial_extended_dialog_description_date",
};
interface Props {
  onClose: () => void;
  primaryActionLabel: string;
  primaryActionOnClick: () => void;
  secondaryActionLabel: string;
  secondaryActionOnClick: () => void;
}
export const TrialExtendedDialog = ({
  onClose,
  primaryActionLabel,
  primaryActionOnClick,
  secondaryActionLabel,
  secondaryActionOnClick,
}: Props) => {
  const { translate } = useTranslate();
  const { shortDate } = translate;
  const getTeamBillingInformation = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamBillingInformation"
  );
  const teamBillingInformation =
    getTeamBillingInformation.status === DataStatus.Success &&
    getTeamBillingInformation.data
      ? getTeamBillingInformation.data
      : null;
  useEffect(() => {
    if (teamBillingInformation) {
      logPageView(PageView.TacModalTrialHasBeenExtended);
    }
  }, [teamBillingInformation]);
  if (!teamBillingInformation) {
    return null;
  }
  const isTeamPlan = teamBillingInformation.spaceTier === SpaceTier.Team;
  const endDate = teamBillingInformation.nextBillingDetails.dateUnix;
  const daysLeft = teamBillingInformation.daysLeftUntilNextBillingPeriod;
  const formattedEndDate = shortDate(fromUnixTime(endDate), LocaleFormat.LL);
  return (
    <Dialog
      closeActionLabel={translate(I18N_KEYS.CLOSE_BUTTON)}
      onClose={onClose}
      isOpen={true}
      title={translate(I18N_KEYS.TITLE)}
      actions={{
        primary: {
          children: primaryActionLabel,
          onClick: primaryActionOnClick,
        },
        secondary: {
          children: secondaryActionLabel,
          onClick: secondaryActionOnClick,
        },
      }}
    >
      <Paragraph
        textStyle="ds.body.standard.strong"
        sx={{ marginBottom: "5px" }}
      >
        {translate(
          isTeamPlan
            ? I18N_KEYS.DAYS_LEFT_SUBTITLE_TEAM
            : I18N_KEYS.DAYS_LEFT_SUBTITLE_BUSINESS,
          { count: daysLeft }
        )}
      </Paragraph>
      <Paragraph textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.DESCRIPTION, { endDate: formattedEndDate })}
      </Paragraph>
    </Dialog>
  );
};
