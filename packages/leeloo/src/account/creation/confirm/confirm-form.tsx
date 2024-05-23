import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { Maybe } from 'tsmonad';
import { PasswordInput, PasswordStrength } from '@dashlane/ui-components';
import { carbonConnector } from 'libs/carbon/connector';
import Checkbox from 'libs/dashlane-style/checkbox';
import PrimaryButton from 'libs/dashlane-style/buttons/modern/primary';
import Link from 'libs/dashlane-style/link';
import useTranslate from 'libs/i18n/useTranslate';
import { usePasswordStrength } from 'libs/password-evaluation/usePasswordStrength';
import { ZXCVBN_SCORE_TRANSLATION_MAPPING } from 'libs/password-evaluation/helpers';
import { redirect } from 'libs/router';
import * as flow from 'account/creation/flow';
import Header from 'account/creation/header';
import { PasswordStrengthTooltip } from 'account/creation/confirm/password-strength-tooltip';
import accountCreationStyles from '../styles/index.css';
import disclaimerStyles from '../styles/disclaimer.css';
enum ErrorTypes {
    WRONG_PASSWORD_ERROR = 'wrong_password',
    PASSWORDS_DONT_MATCH_ERROR = 'passwords_dont_match',
    WEAK_PASSWORD_ERROR = 'weak_password',
    SAME_MASTER_PASSWORD = 'same_master_password'
}
enum SubmitButtonType {
    SUBMIT = 'submit',
    ENCRYPTION_ADVANCED = 'encryption_advanced',
    ENCRYPTION_STARTED = 'encryption_started'
}
export interface ConfirmSubmitOptions {
    password: string;
    emailsTipsAndOffers: Maybe<boolean>;
    privacyPolicyAndToS: Maybe<boolean>;
    isEu: boolean | null;
}
export interface Props {
    onSubmit: (options: ConfirmSubmitOptions) => Promise<void>;
    options: {
        flowIndicator: flow.Indicator;
    };
    isEu: boolean | null;
}
export const ConfirmForm = ({ onSubmit, options, isEu }: Props) => {
    const { translate } = useTranslate();
    const [isEmailsTipsAndOffersChecked, setIsEmailsTipsAndOffersChecked] = useState<Maybe<boolean>>(Maybe.nothing());
    const [privacyPolicyAndToS, setPrivacyPolicyAndToS] = useState<Maybe<boolean>>(Maybe.nothing());
    const [createPasswordValue, setCreatePasswordValue] = useState('');
    const [createPasswordErrorType, setCreatePasswordErrorType] = useState<ErrorTypes.WEAK_PASSWORD_ERROR | ErrorTypes.SAME_MASTER_PASSWORD | null>(null);
    const { passwordStrength, resetPasswordStrength, setPasswordStrength, isPasswordStrengthScore, isPasswordStrongEnough, } = usePasswordStrength();
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    const [confirmPasswordErrorType, setConfirmPasswordErrorType] = useState<ErrorTypes.PASSWORDS_DONT_MATCH_ERROR | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [buttonType, setButtonType] = useState<SubmitButtonType>(SubmitButtonType.SUBMIT);
    const handleEmailsTipsAndOffersChanged = (isChecked: boolean) => {
        setIsEmailsTipsAndOffersChecked(Maybe.maybe(isChecked));
    };
    useEffect(() => {
        handleEmailsTipsAndOffersChanged(!isEu);
    }, [isEu]);
    const getButtonText = (type: SubmitButtonType) => translate(flow.accountCreationPrefixMap[options.flowIndicator] +
        'button_text_' +
        type);
    const getPasswordErrorText = (passwordErrorType: string | null) => {
        if (!passwordErrorType) {
            return undefined;
        }
        return translate(flow.accountCreationPrefixMap[options.flowIndicator] +
            'error_' +
            passwordErrorType);
    };
    const handleBackButtonClicked = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setCreatePasswordErrorType(null);
        setConfirmPasswordErrorType(null);
        redirect(flow.createPathMap[options.flowIndicator]);
    };
    const handleCreatePasswordChanged = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value;
        setCreatePasswordValue(password);
        if (createPasswordErrorType) {
            setCreatePasswordErrorType(null);
        }
        if (confirmPasswordErrorType) {
            setConfirmPasswordErrorType(null);
        }
        if (password === '') {
            resetPasswordStrength();
        }
        if (password !== '') {
            const currentPasswordStrength = await carbonConnector.evaluatePassword({
                password,
            });
            setPasswordStrength(currentPasswordStrength);
        }
    };
    const handleConfirmPasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordErrorType(null);
        setConfirmPasswordValue(event.target.value);
    };
    const handleConfirmPasswordBlurred = () => {
        if (confirmPasswordValue && createPasswordValue !== confirmPasswordValue) {
            setConfirmPasswordErrorType(ErrorTypes.PASSWORDS_DONT_MATCH_ERROR);
        }
    };
    const handleConfirmFormSubmitted = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (createPasswordValue !== confirmPasswordValue) {
            setConfirmPasswordErrorType(ErrorTypes.PASSWORDS_DONT_MATCH_ERROR);
            return;
        }
        const submitOptions: ConfirmSubmitOptions = {
            emailsTipsAndOffers: isEmailsTipsAndOffersChecked,
            isEu,
            password: createPasswordValue,
            privacyPolicyAndToS,
        };
        setButtonType(SubmitButtonType.ENCRYPTION_STARTED);
        setIsLoading(true);
        onSubmit(submitOptions).then(() => {
            setIsLoading(true);
            setButtonType(SubmitButtonType.ENCRYPTION_ADVANCED);
        }, () => {
            setIsLoading(false);
            setButtonType(SubmitButtonType.SUBMIT);
        });
    };
    const handleCreatePasswordBlurred = () => {
        setShowTooltip(false);
        if (!createPasswordValue) {
            return;
        }
        if (createPasswordValue && !isPasswordStrongEnough) {
            setCreatePasswordErrorType(ErrorTypes.WEAK_PASSWORD_ERROR);
        }
        else if (confirmPasswordValue &&
            createPasswordValue &&
            createPasswordValue !== confirmPasswordValue) {
            setConfirmPasswordErrorType(ErrorTypes.PASSWORDS_DONT_MATCH_ERROR);
        }
    };
    const handleCreatePasswordFocused = () => {
        setShowTooltip(true);
    };
    const isDisabled = () => {
        if (isEu && !privacyPolicyAndToS.valueOr(false)) {
            return true;
        }
        const isEmptyPasswords = !createPasswordValue || !confirmPasswordValue;
        const isSamePassword = confirmPasswordValue === createPasswordValue;
        return isEmptyPasswords || !isSamePassword || !isPasswordStrongEnough;
    };
    const handlePrivacyPolicyAndToSChanged = (isChecked: boolean) => {
        setPrivacyPolicyAndToS(Maybe.maybe(isChecked));
    };
    const _ = translate.namespace(flow.accountCreationPrefixMap[options.flowIndicator]);
    const termsOfServiceLabel = _.markup('confirm_terms_of_service_markup', {}, { linkTarget: '_blank' }) as string;
    const emailsTipsAndOffersLabel = _('confirm_tips_and_offers_label');
    const shouldDisplayTipsAndOffers = isEu !== null;
    return (<div className={accountCreationStyles.wrapper}>
      <Header />
      <div className={accountCreationStyles.content}>
        <div className={accountCreationStyles.inner}>
          <h1 className={accountCreationStyles.heading}>
            {_('confirm_create_your_password')}
          </h1>
          <h2 className={accountCreationStyles.subHeading}>
            {_('confirm_subheader')}
          </h2>

          <form className={accountCreationStyles.form} autoComplete="off" noValidate={true} onSubmit={handleConfirmFormSubmitted}>
            <div className={accountCreationStyles.createPasswordContainer}>
              <PasswordStrengthTooltip showTooltip={showTooltip} passwordStrength={passwordStrength} id="password-tooltip">
                <>
                  
                  <PasswordInput id="primaryPasswordInput" showPasswordTooltipText={_('password_show_label')} hidePasswordTooltipText={_('password_hide_label')} onBlur={handleCreatePasswordBlurred} onFocus={handleCreatePasswordFocused} onChange={handleCreatePasswordChanged} placeholder={_('password_hint_text')} value={createPasswordValue} label={_('password_floating_label')} feedbackType={createPasswordErrorType ? 'error' : undefined} feedbackText={createPasswordErrorType
            ? getPasswordErrorText(createPasswordErrorType)
            : ''}/>
                </>
              </PasswordStrengthTooltip>
              {passwordStrength &&
            isPasswordStrengthScore(passwordStrength.score) && (<PasswordStrength score={passwordStrength.score} showAdditionalText additionalText={translate(`${flow.accountCreationPrefixMap[options.flowIndicator]}${ZXCVBN_SCORE_TRANSLATION_MAPPING[passwordStrength.score]}`)}/>)}
            </div>
            <PasswordInput inputId="secondaryPasswordInput" value={confirmPasswordValue} showPasswordTooltipText={_('confirm_password_show_label')} hidePasswordTooltipText={_('confirm_password_hide_label')} placeholder={_('confirm_password_hint_text')} onBlur={handleConfirmPasswordBlurred} onChange={handleConfirmPasswordChanged} label={_('confirm_password_floating_label')} feedbackType={confirmPasswordErrorType ? 'error' : undefined} feedbackText={confirmPasswordErrorType
            ? getPasswordErrorText(confirmPasswordErrorType)
            : ''}/>

            <div className={classnames(disclaimerStyles.disclaimerCheckboxWrapper, shouldDisplayTipsAndOffers ? disclaimerStyles.visible : {})}>
              <Checkbox label={emailsTipsAndOffersLabel} labelClass={disclaimerStyles.disclaimerCheckbox} name="emailsTipsAndOffers" onCheck={handleEmailsTipsAndOffersChanged} checked={isEmailsTipsAndOffersChecked.valueOr(!isEu)}/>
            </div>

            {isEu && (<div className={disclaimerStyles.disclaimer}>
                <Checkbox label={termsOfServiceLabel} labelClass={classnames(disclaimerStyles.disclaimerCheckbox, disclaimerStyles.mandatory)} name="privacyPolicyAndToS" onCheck={handlePrivacyPolicyAndToSChanged} checked={privacyPolicyAndToS.valueOr(false)}/>
              </div>)}

            <div className={accountCreationStyles.formAction}>
              <PrimaryButton type="submit" size="large" label={getButtonText(buttonType)} disabled={isDisabled()} loading={isLoading} classNames={[accountCreationStyles.nextButton]}/>
            </div>

            {!isEu && (<p className={classnames(disclaimerStyles.disclaimer, disclaimerStyles.disclaimerUs)}>
                {`${_('content_form_disclaimer1')} `}
                <Link href="*****" title={_('content_form_dashlane_terms_title')} target="_blank" rel="noopener noreferrer" className={disclaimerStyles.link}>
                  {_('content_form_dashlane_terms')}
                </Link>
                {` ${_('content_form_disclaimer2')} `}
                <Link href="*****" title={_('content_form_privacy_policy_title')} target="_blank" rel="noopener noreferrer" className={disclaimerStyles.link}>
                  {_('content_form_privacy_policy')}
                </Link>
                {_('content_form_disclaimer3')}
              </p>)}

            <div className={classnames(disclaimerStyles.disclaimerCheckbox, disclaimerStyles.backButtonContainer)}>
              <button disabled={isLoading} className={disclaimerStyles.backButton} onClick={handleBackButtonClicked} type="button">
                {_('confirm_back_button')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>);
};
