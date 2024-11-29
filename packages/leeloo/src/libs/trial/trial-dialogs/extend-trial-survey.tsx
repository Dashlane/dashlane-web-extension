import { useEffect, useState } from "react";
import {
  CallToAction,
  FormName,
  PageView,
  PossibleFormAnswers as ReasonToExtendTrialAnswer,
  UserCallToActionEvent,
  UserSubmitInProductFormAnswerEvent,
} from "@dashlane/hermes";
import { Checkbox, Dialog, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../i18n/useTranslate";
import { logEvent, logPageView } from "../../logs/logEvent";
const I18N_KEYS = {
  CLOSE: "_common_dialog_dismiss_button",
  ACTION_SEND: "team_trial_extension_survey_button_send",
  ACTION_SKIP: "team_trial_extension_survey_button_skip",
  SURVEY_TITLE: "team_trial_extension_survey_title",
  SURVEY_SUBTITLE: "team_trial_extension_survey_subtitle_markup",
  OPTIONS_TITLE: "team_trial_extension_survey_options_title",
  OPTION_TIME_FOR_TEAM: "team_trial_extension_survey_option_time_for_team",
  OPTION_TIME_FOR_DECISION_MAKER:
    "team_trial_extension_survey_option_time_for_decision_maker",
  OPTION_HELP_SSO: "team_trial_extension_survey_option_help_sso",
  OPTION_HELP_SCIM: "team_trial_extension_survey_option_help_scim",
  OPTION_SALES_REP: "team_trial_extension_survey_option_sales_rep",
  OPTION_UNAWARE: "team_trial_extension_survey_option_unaware",
  OPTION_OTHER: "team_trial_extension_survey_option_other",
};
interface Props {
  isOpen: boolean;
  handleClose: () => void;
}
export const ExtendTrialSurvey = ({ isOpen, handleClose }: Props) => {
  const { translate } = useTranslate();
  const [reasons, setReasons] = useState<
    Partial<Record<ReasonToExtendTrialAnswer, boolean>>
  >({
    [ReasonToExtendTrialAnswer.NeedMoreTimeTeamUsage]: false,
    [ReasonToExtendTrialAnswer.NeedMoreTimeConvince]: false,
    [ReasonToExtendTrialAnswer.NotAwareTrialEnding]: false,
    [ReasonToExtendTrialAnswer.NeedHelpSso]: false,
    [ReasonToExtendTrialAnswer.NeedHelpScim]: false,
    [ReasonToExtendTrialAnswer.NeedSalesRep]: false,
    [ReasonToExtendTrialAnswer.Other]: false,
  });
  useEffect(() => {
    if (isOpen) {
      logPageView(PageView.TacModalReasonsToExtendTrial);
    }
  }, [isOpen]);
  const handleChangeCheckbox = (reason: ReasonToExtendTrialAnswer) => {
    const newReasonChecked = !reasons[reason];
    setReasons({
      ...reasons,
      [reason]: newReasonChecked,
    });
  };
  const handleSendSurvey = () => {
    logEvent(
      new UserCallToActionEvent({
        callToActionList: [CallToAction.Skip, CallToAction.Send],
        chosenAction: CallToAction.Send,
        hasChosenNoAction: false,
      })
    );
    logEvent(
      new UserSubmitInProductFormAnswerEvent({
        formName: FormName.ReasonToExtendTrial,
        answerList: [
          ReasonToExtendTrialAnswer.NeedMoreTimeTeamUsage,
          ReasonToExtendTrialAnswer.NeedMoreTimeConvince,
          ReasonToExtendTrialAnswer.NotAwareTrialEnding,
          ReasonToExtendTrialAnswer.NeedHelpSso,
          ReasonToExtendTrialAnswer.NeedHelpScim,
          ReasonToExtendTrialAnswer.NeedSalesRep,
          ReasonToExtendTrialAnswer.Other,
        ],
        chosenAnswerList: Object.keys(reasons).filter(
          (item) => reasons[item]
        ) as ReasonToExtendTrialAnswer[],
      })
    );
    handleClose();
  };
  const handleCloseSurvey = () => {
    logEvent(
      new UserCallToActionEvent({
        callToActionList: [CallToAction.Skip, CallToAction.Send],
        hasChosenNoAction: true,
      })
    );
    handleClose();
  };
  const handleSkipSurvey = () => {
    logEvent(
      new UserCallToActionEvent({
        callToActionList: [CallToAction.Skip, CallToAction.Send],
        chosenAction: CallToAction.Skip,
        hasChosenNoAction: false,
      })
    );
    handleClose();
  };
  return (
    <Dialog
      isOpen={isOpen}
      isMandatory
      onClose={handleCloseSurvey}
      title={translate(I18N_KEYS.SURVEY_TITLE)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.ACTION_SEND),
          onClick: handleSendSurvey,
        },
        secondary: {
          children: translate(I18N_KEYS.ACTION_SKIP),
          onClick: handleSkipSurvey,
        },
      }}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
    >
      <Paragraph sx={{ marginBottom: "20px" }} as="h2">
        {translate.markup(I18N_KEYS.SURVEY_SUBTITLE)}
      </Paragraph>
      <Paragraph sx={{ marginBottom: "10px" }} as="h3">
        {translate(I18N_KEYS.OPTIONS_TITLE)}
      </Paragraph>
      <div sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Checkbox
          label={translate(I18N_KEYS.OPTION_TIME_FOR_TEAM)}
          checked={reasons.need_more_time_team_usage}
          onChange={() =>
            handleChangeCheckbox(
              ReasonToExtendTrialAnswer.NeedMoreTimeTeamUsage
            )
          }
        />
        <Checkbox
          label={translate(I18N_KEYS.OPTION_TIME_FOR_DECISION_MAKER)}
          checked={reasons.need_more_time_convince}
          onChange={() =>
            handleChangeCheckbox(ReasonToExtendTrialAnswer.NeedMoreTimeConvince)
          }
        />
        <Checkbox
          label={translate(I18N_KEYS.OPTION_UNAWARE)}
          checked={reasons.not_aware_trial_ending}
          onChange={() =>
            handleChangeCheckbox(ReasonToExtendTrialAnswer.NotAwareTrialEnding)
          }
        />
        <Checkbox
          label={translate(I18N_KEYS.OPTION_HELP_SSO)}
          checked={reasons.need_help_sso}
          onChange={() =>
            handleChangeCheckbox(ReasonToExtendTrialAnswer.NeedHelpSso)
          }
        />
        <Checkbox
          label={translate(I18N_KEYS.OPTION_HELP_SCIM)}
          checked={reasons.need_help_scim}
          onChange={() =>
            handleChangeCheckbox(ReasonToExtendTrialAnswer.NeedHelpScim)
          }
        />
        <Checkbox
          label={translate(I18N_KEYS.OPTION_SALES_REP)}
          checked={reasons.need_sales_rep}
          onChange={() =>
            handleChangeCheckbox(ReasonToExtendTrialAnswer.NeedSalesRep)
          }
        />
        <Checkbox
          sx={{ marginBottom: "8px" }}
          label={translate(I18N_KEYS.OPTION_OTHER)}
          checked={reasons.other}
          onChange={() => handleChangeCheckbox(ReasonToExtendTrialAnswer.Other)}
        />
      </div>
    </Dialog>
  );
};
