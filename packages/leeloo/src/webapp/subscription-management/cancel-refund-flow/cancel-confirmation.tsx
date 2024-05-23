import { Fragment, useEffect } from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { CancelPlanStep, PageView, SurveyAnswer } from '@dashlane/hermes';
import { Card, FlexContainer, Radio, RadioGroup, } from '@dashlane/ui-components';
import { Button, Heading, IndeterminateLoader, Infobox, jsx, Paragraph, } from '@dashlane/design-system';
import { carbonConnector } from 'libs/carbon/connector';
import { isAccountFamily, isAdvancedPlan, isEssentialsPlan, } from 'libs/account/helpers';
import { LocaleFormat } from 'libs/i18n/helpers';
import { logPageView } from 'libs/logs/logEvent';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { CancellationStep } from 'webapp/subscription-management/subscription-page';
import { logCancellationEvent } from 'webapp/subscription-management/logs';
const I18N_KEYS = {
    BUTTON_CANCEL: 'manage_subscription_cancel_section_button_cancel',
    BUTTON_KEEP_ADVANCED: 'manage_subscription_cancel_section_button_keep_advanced',
    BUTTON_KEEP_ESSENTIALS: 'manage_subscription_cancel_section_button_keep_essentials',
    BUTTON_KEEP_FAMILY: 'manage_subscription_cancel_section_button_keep_family',
    BUTTON_KEEP_PREMIUM: 'manage_subscription_cancel_section_button_keep_premium',
    CARD_TITLE: 'manage_subscription_cancel_section_with_survey_card_title',
    CARD_SURVEY_TITLE: 'manage_subscription_cancel_section_with_survey_card_survey_title',
    DESC_ADVANCED: 'manage_subscription_cancel_section_with_survey_desc_advanced_markup',
    DESC_ESSENTIALS: 'manage_subscription_cancel_section_with_survey_desc_essentials_markup',
    DESC_FAMILY: 'manage_subscription_cancel_section_with_survey_desc_family_markup',
    DESC_PREMIUM: 'manage_subscription_cancel_section_with_survey_desc_premium_markup',
    CARD_SURVEY_RADIO_DESCRIPTION_DIDNT_WORK: 'manage_subscription_cancel_section_with_survey_radio_desc_didnt_work_markup',
    CARD_SURVEY_RADIO_DESCRIPTION_DOESNT_HAVE_FEATURES_NEEDED: 'manage_subscription_cancel_section_with_survey_radio_desc_doesnt_have_features_needed_markup',
    CARD_SURVEY_RADIO_DESCRIPTION_TECH_ISSUES: 'manage_subscription_cancel_section_with_survey_radio_desc_tech_issues_markup',
    CARD_SURVEY_RADIO_DESCRIPTION_TOO_EXPENSIVE: 'manage_subscription_cancel_section_with_survey_radio_desc_too_expensive_markup',
    CARD_SURVEY_RADIO_LABEL_DIDNT_WORK: 'manage_subscription_cancel_section_with_survey_radio_label_didnt_work',
    CARD_SURVEY_RADIO_LABEL_DOESNT_HAVE_FEATURES_NEEDED: 'manage_subscription_cancel_section_with_survey_radio_label_doesnt_have_features_needed',
    CARD_SURVEY_RADIO_LABEL_TECH_ISSUES: 'manage_subscription_cancel_section_with_survey_radio_label_tech_issues',
    CARD_SURVEY_RADIO_LABEL_TOO_EXPENSIVE: 'manage_subscription_cancel_section_with_survey_radio_label_too_expensive',
    WARN_ADVANCED: 'manage_subscription_cancel_section_with_survey_warning_advanced_markup',
    WARN_ESSENTIALS: 'manage_subscription_cancel_section_with_survey_warning_essentials_markup',
    WARN_FAMILY: 'manage_subscription_cancel_section_with_survey_warning_family_markup',
    WARN_PREMIUM: 'manage_subscription_cancel_section_with_survey_warning_premium_markup',
    WARN_FEATURE_DARKWEB: 'manage_subscription_cancel_section_warning_feature_dark_web',
    WARN_FEATURE_TWO_DEVICES: 'manage_subscription_cancel_section_warning_feature_two_devices',
    WARN_FEATURE_UNLIMITED: 'manage_subscription_cancel_section_warning_feature_unlimited_devices',
    WARN_FEATURE_VPN: 'manage_subscription_cancel_section_warning_feature_vpn',
};
const FIXTURES = {
    advanced: {
        descriptionText: I18N_KEYS.DESC_ADVANCED,
        warningText: I18N_KEYS.WARN_ADVANCED,
        keepButtonText: I18N_KEYS.BUTTON_KEEP_ADVANCED,
        featureList: [
            I18N_KEYS.WARN_FEATURE_UNLIMITED,
            I18N_KEYS.WARN_FEATURE_DARKWEB,
        ],
    },
    essentials: {
        descriptionText: I18N_KEYS.DESC_ESSENTIALS,
        warningText: I18N_KEYS.WARN_ESSENTIALS,
        keepButtonText: I18N_KEYS.BUTTON_KEEP_ESSENTIALS,
        featureList: [
            I18N_KEYS.WARN_FEATURE_UNLIMITED,
            I18N_KEYS.WARN_FEATURE_DARKWEB,
        ],
    },
    family: {
        descriptionText: I18N_KEYS.DESC_FAMILY,
        warningText: I18N_KEYS.WARN_FAMILY,
        keepButtonText: I18N_KEYS.BUTTON_KEEP_FAMILY,
        featureList: [
            I18N_KEYS.WARN_FEATURE_UNLIMITED,
            I18N_KEYS.WARN_FEATURE_DARKWEB,
            I18N_KEYS.WARN_FEATURE_VPN,
        ],
    },
    premium: {
        descriptionText: I18N_KEYS.DESC_PREMIUM,
        warningText: I18N_KEYS.WARN_PREMIUM,
        keepButtonText: I18N_KEYS.BUTTON_KEEP_PREMIUM,
        featureList: [
            I18N_KEYS.WARN_FEATURE_UNLIMITED,
            I18N_KEYS.WARN_FEATURE_DARKWEB,
            I18N_KEYS.WARN_FEATURE_VPN,
        ],
    },
};
const getFixture = (isAdvanced: boolean, isEssentials: boolean, isFamily: boolean) => {
    if (isAdvanced) {
        return FIXTURES.advanced;
    }
    if (isEssentials) {
        return FIXTURES.essentials;
    }
    if (isFamily) {
        return FIXTURES.family;
    }
    return FIXTURES.premium;
};
const DIVIDER_STYLES = {
    borderTop: '1px solid ds.container.agnostic.neutral.standard',
    width: '100%',
    marginBottom: '32px',
};
const MESSAGE_STYLES = {
    color: 'ds.text.neutral.catchy',
    backgroundColor: 'ds.container.expressive.neutral.quiet.idle',
    marginLeft: '36px',
    padding: '4px',
    borderRadius: '4px',
};
const links = {
    support: '*****',
    mailSupport: '*****',
    plans: '*****',
    productBoard: '*****',
};
export interface CancelConfirmationProps {
    setCancellationStep: (step: CancellationStep) => void;
    setSurveyAnswer: (values: SurveyAnswer) => void;
    surveyAnswer?: SurveyAnswer;
}
export const CancelConfirmationCard = ({ setCancellationStep, setSurveyAnswer, surveyAnswer, }: CancelConfirmationProps) => {
    const premiumStatus = usePremiumStatus();
    const { translate } = useTranslate();
    useEffect(() => {
        logPageView(PageView.PlansManagementAskCancel);
    }, []);
    if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
        return <IndeterminateLoader />;
    }
    const { endDate } = premiumStatus.data;
    const renewalDate = endDate ? new Date(endDate * 1000) : null;
    const renewalDateText = renewalDate
        ? translate.shortDate(renewalDate, LocaleFormat.LL)
        : '';
    const { descriptionText, warningText, keepButtonText, featureList } = getFixture(isAdvancedPlan(premiumStatus.data), isEssentialsPlan(premiumStatus.data), isAccountFamily(premiumStatus.data));
    const handleOnChange = (event: {
        currentTarget: {
            value: SurveyAnswer;
        };
    }) => {
        setSurveyAnswer(event.currentTarget.value);
    };
    const cancelSubscription = async () => {
        setCancellationStep(CancellationStep.CANCEL_PENDING);
        const result = await carbonConnector.cancelAutoRenew();
        setCancellationStep(result.success
            ? CancellationStep.CANCEL_COMPLETE
            : CancellationStep.CANCEL_FAILURE);
    };
    return (<Card sx={{ padding: '32px' }}>
      <Heading sx={{ marginBottom: '40px' }} as="h4">
        {translate(I18N_KEYS.CARD_TITLE)}
      </Heading>

      <Paragraph sx={{ marginBottom: '15px' }}>
        {translate.markup(descriptionText, { date: renewalDateText })}
      </Paragraph>

      <Infobox mood="warning" sx={{ marginBottom: '32px' }} title={<p>
            {translate.markup(warningText, { date: renewalDateText })}{' '}
            {featureList.map((feature, index) => {
                let punctuation;
                index++;
                if (index === featureList.length - 1) {
                    punctuation = ' and ';
                }
                else if (index === featureList.length) {
                    punctuation = '.';
                }
                else {
                    punctuation = ', ';
                }
                return (<span key={`featureList${feature}`}>
                  {translate(feature)}
                  {punctuation}
                </span>);
            })}
          </p>}/>

      <>
        <hr sx={DIVIDER_STYLES}/>
        <Heading sx={{ marginBottom: '40px' }} as="h4">
          {translate(I18N_KEYS.CARD_SURVEY_TITLE)}
        </Heading>

        <RadioGroup value={surveyAnswer} name="cancellationSurveyRadioGroup" onChange={handleOnChange} sx={{ marginBottom: '40px' }}>
          <FlexContainer flexDirection="column">
            <Radio label={translate(I18N_KEYS.CARD_SURVEY_RADIO_LABEL_DIDNT_WORK)} value={SurveyAnswer.AutofillDidntWorkAsExpected}/>
            {surveyAnswer === SurveyAnswer.AutofillDidntWorkAsExpected && (<Paragraph sx={MESSAGE_STYLES}>
                {translate.markup(I18N_KEYS.CARD_SURVEY_RADIO_DESCRIPTION_DIDNT_WORK, {
                supportLink: links.support,
                mailSupportLink: links.mailSupport,
            })}
              </Paragraph>)}
            <Radio label={translate(I18N_KEYS.CARD_SURVEY_RADIO_LABEL_TECH_ISSUES)} value={SurveyAnswer.ThereWereTooManyTechnicalIssues}/>
            {surveyAnswer === SurveyAnswer.ThereWereTooManyTechnicalIssues && (<Paragraph sx={MESSAGE_STYLES}>
                {translate.markup(I18N_KEYS.CARD_SURVEY_RADIO_DESCRIPTION_TECH_ISSUES, {
                supportLink: links.support,
                mailSupportLink: links.mailSupport,
            })}
              </Paragraph>)}
            <Radio label={translate(I18N_KEYS.CARD_SURVEY_RADIO_LABEL_TOO_EXPENSIVE)} value={SurveyAnswer.DashlaneIsTooExpensive}/>
            {surveyAnswer === SurveyAnswer.DashlaneIsTooExpensive && (<Paragraph sx={MESSAGE_STYLES}>
                {translate.markup(I18N_KEYS.CARD_SURVEY_RADIO_DESCRIPTION_TOO_EXPENSIVE, {
                plansLink: links.plans,
            })}
              </Paragraph>)}
            <Radio label={translate(I18N_KEYS.CARD_SURVEY_RADIO_LABEL_DOESNT_HAVE_FEATURES_NEEDED)} value={SurveyAnswer.DashlaneDoesntHaveTheFeaturesINeed}/>
            {surveyAnswer ===
            SurveyAnswer.DashlaneDoesntHaveTheFeaturesINeed && (<Paragraph sx={MESSAGE_STYLES}>
                {translate.markup(I18N_KEYS.CARD_SURVEY_RADIO_DESCRIPTION_DOESNT_HAVE_FEATURES_NEEDED, {
                productBoardLink: links.productBoard,
            })}
              </Paragraph>)}
          </FlexContainer>
        </RadioGroup>
      </>

      <Button sx={{ marginRight: '8px' }} intensity="supershy" data-testid="keepSubscriptionConfirmation" onClick={() => {
            setCancellationStep(CancellationStep.SUBSCRIPTION);
            logCancellationEvent(CancelPlanStep.Abandon, premiumStatus.data, surveyAnswer);
        }}>
        {translate(keepButtonText)}
      </Button>
      <Button data-testid="cancelMySubscriptionConfirmation" onClick={cancelSubscription}>
        {translate(I18N_KEYS.BUTTON_CANCEL)}
      </Button>
    </Card>);
};
