import React, { useEffect, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { WebOnboardingLeelooStep } from '@dashlane/communication';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { CheckIcon, colors, DashlaneLogoIcon, ForwardIcon, MagicWandIcon, MobileIcon, PasswordsIcon, } from '@dashlane/ui-components';
import { Lee } from 'lee';
import Animation from 'libs/dashlane-style/animation';
import useTranslate from 'libs/i18n/useTranslate';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { getMobileDevices, setOnboardingMode } from '../services';
import { NonCompletedStep } from '../onboarding-step/non-completed-step/non-completed-step';
import onboardingTransitions from '../onboarding-transitions.css';
import spinnerAnimation from '../../../animation-data/spinner.json';
import { useIdentitiesCount } from './use-identities-count';
import { CompletedStep } from '../onboarding-step/completed-step/completed-step';
import styles from '../styles.css';
import cssVariables from '../../variables.css';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { OnboardingTask, PageView, UserCompleteOnboardingTaskEvent, } from '@dashlane/hermes';
const I18N_KEYS = {
    CHECK_ICON_TITLE_SVG: 'web_onboarding_step_check_icon',
    RIGHT_FACING_ARROW_TITLE_SVG: 'web_onboarding_step_right_facing_arrow',
    PASSWORD_COMPLETED_ICON_TITLE_SVG: 'web_onboarding_step_password_completed_icon',
    PASSWORD_ICON_TITLE_SVG: 'web_onboarding_step_password_icon',
    MOBILE_COMPLETED_ICON_TITLE_SVG: 'web_onboarding_step_mobile_completed_icon',
    MOBILE_ICON_TITLE_SVG: 'web_onboarding_step_mobile_icon',
    AUTOFILL_COMPLETED_ICON_TITLE_SVG: 'web_onboarding_step_autofill_completed_icon',
    AUTOFILL_ICON_TITLE_SVG: 'web_onboarding_step_autofill_icon',
    ADD_PASSWORD_TITLE: 'web_onboarding_add_first_password_message',
    ADD_PASSWORD_DESCRIPTION: 'web_onboarding_hover_message',
    TRY_AUTOFILL_TITLE: 'web_onboarding_try_autofill_step_message',
    TRY_AUTOFILL_DESCRIPTION: 'web_onboarding_try_autofill_step_hover_message',
    ADD_MOBILE_TITLE: 'web_onboarding_card_add_mobile',
    ADD_MOBILE_DESCRIPTION: 'web_onboarding_add_mobile_hover_message',
    ADD_MOBILE_ERROR: 'web_onboarding_add_mobile_error_message',
    GET_DASHLANE_TITLE: 'web_onboarding_get_dashlane_message',
};
const onboardingTransitionTimeouts = {
    enter: parseInt(cssVariables['--transition-duration-arriving'], 10),
    exit: parseInt(cssVariables['--transition-duration-leaving'], 10),
};
const KEY_PREFIX = 'for-CSSTransition-';
const ANIM_SIZE = 24;
const addMobileSpinner = (<Animation key={`${KEY_PREFIX}spinner`} height={ANIM_SIZE} width={ANIM_SIZE} animationParams={{
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: spinnerAnimation,
    }}/>);
interface Props {
    lee: Lee;
}
export const OnboardingSteps = ({ lee }: Props) => {
    const { addMobileOnWeb, onboardingHubShown, tryAutofillOnWeb, saveCredentialOnWeb, } = lee.carbon.webOnboardingMode.completedSteps || {};
    const { flowAddMobileOnWeb } = lee.carbon.webOnboardingMode || {};
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const [addPasswordStepCompleted, setAddPasswordStepCompleted] = useState(saveCredentialOnWeb);
    const [showAddMobileError, setShowAddMobileError] = useState(false);
    const [showAddMobileSpinner, setShowAddMobileSpinner] = useState(false);
    const identitiesCount = useIdentitiesCount();
    const isIdentityExisting = identitiesCount.status === DataStatus.Success && identitiesCount.data > 0;
    const isAutofillStepCompleted = tryAutofillOnWeb || isIdentityExisting;
    const dashlaneLogoIcon = <DashlaneLogoIcon size={40} viewBox="-4 0 30 30"/>;
    const checkIcon = (<CheckIcon title={translate(I18N_KEYS.CHECK_ICON_TITLE_SVG)} color={colors.white} viewBox="-8 -8 26 26"/>);
    const orangeArrowIcon = (<ForwardIcon key={`${KEY_PREFIX}arrow`} title={translate(I18N_KEYS.RIGHT_FACING_ARROW_TITLE_SVG)} color={colors.orange00} size={24}/>);
    useEffect(() => {
        setAddPasswordStepCompleted(saveCredentialOnWeb);
    }, [saveCredentialOnWeb]);
    useEffect(() => {
        logPageView(PageView.HomeOnboardingChecklist);
    }, []);
    const markAddMobileComplete = () => {
        setOnboardingMode({
            completedSteps: { addMobileOnWeb: true },
        });
        logEvent(new UserCompleteOnboardingTaskEvent({
            onboardingTask: OnboardingTask.GetMobileApp,
        }));
    };
    const scheduleAddMobileAnimations = (hasDevice: boolean, delay: number) => {
        setShowAddMobileSpinner(true);
        window.setTimeout(() => {
            if (!hasDevice) {
                setShowAddMobileError(true);
                window.setTimeout(() => {
                    setShowAddMobileError(false);
                    setShowAddMobileSpinner(false);
                }, delay);
                return;
            }
            markAddMobileComplete();
            setShowAddMobileSpinner(false);
        }, delay);
    };
    useEffect(() => {
        const shouldNotGetMobileDevices = addMobileOnWeb || showAddMobileError || showAddMobileSpinner;
        if (shouldNotGetMobileDevices) {
            return;
        }
        getMobileDevices().then((mobileDevices) => {
            const hasMobileDevice = Boolean(mobileDevices.length);
            const TIMEOUT_DELAY = 2500;
            if (!flowAddMobileOnWeb && !hasMobileDevice) {
                return;
            }
            if (flowAddMobileOnWeb) {
                scheduleAddMobileAnimations(hasMobileDevice, TIMEOUT_DELAY);
                return;
            }
            markAddMobileComplete();
        });
    }, [flowAddMobileOnWeb]);
    useEffect(() => {
        if (saveCredentialOnWeb) {
            logEvent(new UserCompleteOnboardingTaskEvent({
                onboardingTask: OnboardingTask.AddFirstLogin,
            }));
        }
    }, [saveCredentialOnWeb]);
    useEffect(() => {
        if (isAutofillStepCompleted) {
            logEvent(new UserCompleteOnboardingTaskEvent({
                onboardingTask: OnboardingTask.TryAutofill,
            }));
        }
    }, [isAutofillStepCompleted]);
    const onAddPasswordStepClick = () => {
        setOnboardingMode({
            activeOnboardingType: 'saveWeb',
            leelooStep: WebOnboardingLeelooStep.SHOW_SAVE_SITES_DIALOG,
        });
    };
    const onAddMobileStepClick = () => {
        setOnboardingMode({ activeOnboardingType: 'addMobile' });
    };
    const onTryAutofillStepClick = () => {
        setOnboardingMode({ activeOnboardingType: 'tryAutofill' });
    };
    const hasNotSeenWebOnboardingHub = onboardingHubShown === false;
    if (hasNotSeenWebOnboardingHub) {
        setOnboardingMode({
            completedSteps: { onboardingHubShown: true },
        });
    }
    const addPasswordIcon = (<PasswordsIcon title={addPasswordStepCompleted
            ? translate(I18N_KEYS.PASSWORD_COMPLETED_ICON_TITLE_SVG)
            : translate(I18N_KEYS.PASSWORD_ICON_TITLE_SVG)} color={addPasswordStepCompleted ? colors.dashGreen00 : colors.dashGreen04} size={40} viewBox="0 0 40 40"/>);
    const addPasswordStepElement = addPasswordStepCompleted ? (<CompletedStep key={`${KEY_PREFIX}complete`} message={translate(I18N_KEYS.ADD_PASSWORD_TITLE)} leftIcon={addPasswordIcon} rightIcon={checkIcon}/>) : (<NonCompletedStep key={`${KEY_PREFIX}not-complete`} message={translate(I18N_KEYS.ADD_PASSWORD_TITLE)} onOnboardingStepClick={onAddPasswordStepClick} messageOnHover={translate(I18N_KEYS.ADD_PASSWORD_DESCRIPTION)} path={routes.userPasswordSites} leftIcon={addPasswordIcon} rightIcon={orangeArrowIcon}/>);
    const tryAutofillIcon = (<MagicWandIcon title={tryAutofillOnWeb
            ? translate(I18N_KEYS.AUTOFILL_COMPLETED_ICON_TITLE_SVG)
            : translate(I18N_KEYS.AUTOFILL_ICON_TITLE_SVG)} color={tryAutofillOnWeb ? colors.dashGreen00 : colors.dashGreen04} size={40} viewBox="0 0 40 40"/>);
    const tryAutofillStepElement = isAutofillStepCompleted ? (<CompletedStep key={`${KEY_PREFIX}complete`} message={translate(I18N_KEYS.TRY_AUTOFILL_TITLE)} leftIcon={tryAutofillIcon} rightIcon={checkIcon}/>) : (<NonCompletedStep key={`${KEY_PREFIX}not-complete`} message={translate(I18N_KEYS.TRY_AUTOFILL_TITLE)} onOnboardingStepClick={onTryAutofillStepClick} messageOnHover={translate(I18N_KEYS.TRY_AUTOFILL_DESCRIPTION)} path={routes.userTryAutofill} leftIcon={tryAutofillIcon} rightIcon={orangeArrowIcon}/>);
    const mobileIcon = (<MobileIcon title={addMobileOnWeb
            ? translate(I18N_KEYS.MOBILE_COMPLETED_ICON_TITLE_SVG)
            : translate(I18N_KEYS.MOBILE_ICON_TITLE_SVG)} color={addMobileOnWeb ? colors.dashGreen00 : colors.dashGreen04} size={38} viewBox="0 0 40 40"/>);
    const addMobileRightIconElement = showAddMobileSpinner
        ? addMobileSpinner
        : orangeArrowIcon;
    const addMobileStepElement = addMobileOnWeb ? (<CompletedStep key={`${KEY_PREFIX}complete`} message={translate(I18N_KEYS.ADD_MOBILE_TITLE)} leftIcon={mobileIcon} rightIcon={checkIcon}/>) : (<NonCompletedStep key={`${KEY_PREFIX}not-complete`} message={translate(I18N_KEYS.ADD_MOBILE_TITLE)} onOnboardingStepClick={onAddMobileStepClick} messageOnHover={translate(I18N_KEYS.ADD_MOBILE_DESCRIPTION)} path={routes.userAddMobile} leftIcon={mobileIcon} rightIcon={<SwitchTransition>
          <CSSTransition key={showAddMobileSpinner
                ? `${KEY_PREFIX}spinner`
                : `${KEY_PREFIX}arrow`} timeout={onboardingTransitionTimeouts} classNames={onboardingTransitions}>
            {addMobileRightIconElement}
          </CSSTransition>
        </SwitchTransition>} messageOnError={showAddMobileError ? translate(I18N_KEYS.ADD_MOBILE_ERROR) : null}/>);
    return (<div className={styles.onboardingStepsWrapper}>
      <CompletedStep message={translate(I18N_KEYS.GET_DASHLANE_TITLE)} leftIcon={dashlaneLogoIcon} rightIcon={checkIcon}/>

      <SwitchTransition>
        <CSSTransition key={addPasswordStepCompleted
            ? `${KEY_PREFIX}complete`
            : `${KEY_PREFIX}not complete`} timeout={onboardingTransitionTimeouts} classNames={onboardingTransitions}>
          {addPasswordStepElement}
        </CSSTransition>
      </SwitchTransition>

      <SwitchTransition>
        <CSSTransition key={tryAutofillOnWeb
            ? `${KEY_PREFIX}complete`
            : `${KEY_PREFIX}not complete`} timeout={onboardingTransitionTimeouts} classNames={onboardingTransitions}>
          {tryAutofillStepElement}
        </CSSTransition>
      </SwitchTransition>

      <SwitchTransition>
        <CSSTransition key={addMobileOnWeb
            ? `${KEY_PREFIX}complete`
            : `${KEY_PREFIX}not complete`} timeout={onboardingTransitionTimeouts} classNames={onboardingTransitions}>
          {addMobileStepElement}
        </CSSTransition>
      </SwitchTransition>
    </div>);
};
