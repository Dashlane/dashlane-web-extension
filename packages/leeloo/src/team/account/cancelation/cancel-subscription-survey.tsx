import { useEffect, useState } from 'react';
import { Checkbox, Dialog, jsx, Paragraph } from '@dashlane/design-system';
import { CallToAction, FormName, PossibleFormAnswers as HermesReasonsForCancelling, PageView, UserCallToActionEvent, UserSubmitInProductFormAnswerEvent, } from '@dashlane/hermes';
import { isValidCancelFlowReason, ReasonsForCancelling, } from '@dashlane/team-admin-contracts';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { ZenDeskRequestStatus } from './cancel-subscription-flow';
const I18N_KEYS = {
    CLOSE: '_common_dialog_dismiss_button',
    TITLE: 'team_account_cancel_form_heading',
    DESCRIPTION: 'team_account_cancel_form_subheading',
    QUESTION: 'team_account_cancel_form_question',
    FEEDBACK: 'team_account_cancel_form_context',
    REASON_NO_INTERNAL_USAGE: 'team_account_cancel_form_option_1',
    REASON_BAD_TIMING_FOR_COMPANY: 'team_account_cancel_form_option_2_revised',
    REASON_CHOSE_OTHER_PWM: 'team_account_cancel_form_option_3',
    REASON_MISSING_CRITICAL_FEATURES: 'team_account_cancel_form_option_4',
    REASON_TECHNICAL_ISSUES: 'team_account_cancel_form_option_5',
    REASON_TOO_EXPENSIVE: 'team_account_cancel_form_option_6',
    REASON_OTHER: 'team_account_cancel_form_option_7',
    FOOTER_NOTE: 'team_account_cancel_form_help_markup',
    KEEP_SUBSCRIPTION_BUTTON: 'team_account_cancel_form_button_cancel',
    CONFIRM_REQUEST_BUTTON: 'team_account_cancel_form_button_confirm',
};
interface Props {
    spaceTier: string;
    handleClose: () => void;
    sendCancelRequest: (reasonsToCancel: ReasonsForCancelling[]) => void;
    requestStatus: ZenDeskRequestStatus;
}
export const CancelSubscriptionSurvey = ({ spaceTier, handleClose, sendCancelRequest, requestStatus, }: Props) => {
    const { translate } = useTranslate();
    const [reasons, setReasons] = useState<Record<ReasonsForCancelling, boolean>>({
        [HermesReasonsForCancelling.ChoseOtherPasswordManager]: false,
        [HermesReasonsForCancelling.MissingCriticalFeatures]: false,
        [HermesReasonsForCancelling.NoInternalUsage]: false,
        [HermesReasonsForCancelling.DownsizedEmployeeCount]: false,
        [HermesReasonsForCancelling.Other]: false,
        [HermesReasonsForCancelling.TechnicalIssues]: false,
        [HermesReasonsForCancelling.TooExpensive]: false,
    });
    useEffect(() => {
        logPageView(PageView.TacModalReasonsToCancelSubscription);
    }, []);
    const capitalizedSpaceTier = `${spaceTier[0].toUpperCase()}${spaceTier.slice(1)}`;
    const handleChangeCheckbox = (reason: HermesReasonsForCancelling) => {
        const newReasonChecked = !reasons[reason];
        setReasons({
            ...reasons,
            [reason]: newReasonChecked,
        });
    };
    const handleCloseSurvey = () => {
        logEvent(new UserCallToActionEvent({
            callToActionList: [CallToAction.Confirm, CallToAction.Cancel],
            hasChosenNoAction: true,
        }));
        handleClose();
    };
    const handleKeepMySubscription = () => {
        logEvent(new UserCallToActionEvent({
            callToActionList: [CallToAction.Confirm, CallToAction.Cancel],
            chosenAction: CallToAction.Cancel,
            hasChosenNoAction: false,
        }));
        handleClose();
    };
    const handleConfirmRequest = () => {
        const chosenAnswerList = Object.keys(reasons).filter((item) => reasons[item]) as HermesReasonsForCancelling[];
        if (chosenAnswerList.every(isValidCancelFlowReason)) {
            sendCancelRequest(chosenAnswerList as unknown as ReasonsForCancelling[]);
        }
        else {
            throw new Error('Invalid cancel subscription reason');
        }
        logEvent(new UserCallToActionEvent({
            callToActionList: [CallToAction.Confirm, CallToAction.Cancel],
            chosenAction: CallToAction.Confirm,
            hasChosenNoAction: false,
        }));
        logEvent(new UserSubmitInProductFormAnswerEvent({
            formName: FormName.ReasonToCancelSubscription,
            answerList: [
                HermesReasonsForCancelling.NoInternalUsage,
                HermesReasonsForCancelling.DownsizedEmployeeCount,
                HermesReasonsForCancelling.ChoseOtherPasswordManager,
                HermesReasonsForCancelling.MissingCriticalFeatures,
                HermesReasonsForCancelling.TechnicalIssues,
                HermesReasonsForCancelling.TooExpensive,
                HermesReasonsForCancelling.Other,
            ],
            chosenAnswerList,
        }));
    };
    return (<Dialog isOpen={true} onClose={handleCloseSurvey} title={translate(I18N_KEYS.TITLE)} actions={{
            primary: {
                children: translate(I18N_KEYS.CONFIRM_REQUEST_BUTTON),
                onClick: handleConfirmRequest,
                isLoading: requestStatus === 'pending',
            },
            secondary: {
                children: translate(I18N_KEYS.KEEP_SUBSCRIPTION_BUTTON, {
                    planTier: capitalizedSpaceTier,
                }),
                onClick: handleKeepMySubscription,
            },
        }} isDestructive closeActionLabel={translate(I18N_KEYS.CLOSE)}>
      <Paragraph sx={{ marginBottom: '20px' }} textStyle="ds.body.standard.regular" color="ds.text.neutral.quiet">
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>
      <Paragraph textStyle="ds.title.block.medium">
        {translate(I18N_KEYS.QUESTION)}
      </Paragraph>
      <Paragraph sx={{ marginBottom: '20px' }} textStyle="ds.body.standard.regular">
        {translate(I18N_KEYS.FEEDBACK)}
      </Paragraph>
      <div sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Checkbox label={translate(I18N_KEYS.REASON_NO_INTERNAL_USAGE)} checked={reasons.no_internal_usage} disabled={requestStatus === 'pending'} onChange={() => handleChangeCheckbox(HermesReasonsForCancelling.NoInternalUsage)}/>
        <Checkbox label={translate(I18N_KEYS.REASON_BAD_TIMING_FOR_COMPANY)} checked={reasons.downsized_employee_count} disabled={requestStatus === 'pending'} onChange={() => handleChangeCheckbox(HermesReasonsForCancelling.DownsizedEmployeeCount)}/>
        <Checkbox label={translate(I18N_KEYS.REASON_CHOSE_OTHER_PWM)} checked={reasons.chose_other_password_manager} disabled={requestStatus === 'pending'} onChange={() => handleChangeCheckbox(HermesReasonsForCancelling.ChoseOtherPasswordManager)}/>
        <Checkbox label={translate(I18N_KEYS.REASON_MISSING_CRITICAL_FEATURES)} checked={reasons.missing_critical_features} disabled={requestStatus === 'pending'} onChange={() => handleChangeCheckbox(HermesReasonsForCancelling.MissingCriticalFeatures)}/>
        <Checkbox label={translate(I18N_KEYS.REASON_TECHNICAL_ISSUES)} checked={reasons.technical_issues} disabled={requestStatus === 'pending'} onChange={() => handleChangeCheckbox(HermesReasonsForCancelling.TechnicalIssues)}/>
        <Checkbox label={translate(I18N_KEYS.REASON_TOO_EXPENSIVE)} checked={reasons.too_expensive} disabled={requestStatus === 'pending'} onChange={() => handleChangeCheckbox(HermesReasonsForCancelling.TooExpensive)}/>
        <Checkbox sx={{ marginBottom: '8px' }} label={translate(I18N_KEYS.REASON_OTHER)} checked={reasons.other} disabled={requestStatus === 'pending'} onChange={() => handleChangeCheckbox(HermesReasonsForCancelling.Other)}/>
      </div>
      <Paragraph sx={{ margin: '20px 0' }} textStyle="ds.body.standard.regular" color="ds.text.neutral.quiet">
        {translate.markup(I18N_KEYS.FOOTER_NOTE, {}, { linkTarget: '_blank' })}
      </Paragraph>
    </Dialog>);
};
