import * as React from 'react';
import classnames from 'classnames';
import { Button, TextInput } from '@dashlane/ui-components';
import { JoinFamilyError } from '@dashlane/communication';
import { FEATURES_URL } from 'app/routes/constants';
import Animation from 'libs/dashlane-style/animation';
import useTranslate from 'libs/i18n/useTranslate';
import { isValidEmail } from 'libs/validators';
import { redirectToUrl } from 'libs/external-urls';
import { JoinFamily } from 'family/join/join';
import { PrivacyNote } from 'family/privacy-note/privacy-note';
import { ErrorDialog } from 'family/error-dialog/error-dialog';
import familyAnimation from '../assets/family-animation.json';
import sharedStyles from '../shared/styles.css';
import styles from './styles.css';
export interface FormProps {
    errorCode: JoinFamilyError | null;
    handleJoinFamily: (login: string) => Promise<void>;
    handleResetErrorCode: () => void;
}
const ANIMATION_SIZE = 400;
interface SetLoginFormProps {
    handleJoinFamily: (login: string) => Promise<void>;
    displayLoginErrorCode: boolean;
}
const SetLoginForm = ({ handleJoinFamily, displayLoginErrorCode, }: SetLoginFormProps) => {
    const { translate } = useTranslate();
    const [login, setLogin] = React.useState('');
    const [showLoginError, setShowLoginError] = React.useState(false);
    const handleLoginChanged = React.useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(evt.target.value);
        if (showLoginError) {
            setShowLoginError(false);
        }
    }, [setLogin, showLoginError]);
    const handleFormSubmitted = (event: React.SyntheticEvent<HTMLElement>) => {
        event.preventDefault();
        if (!isValidEmail(login)) {
            setShowLoginError(true);
            return;
        }
        handleJoinFamily(login);
    };
    return (<form className={styles.loginWrapper} onSubmit={handleFormSubmitted} noValidate>
      <div className={styles.loginTextFieldWrapper}>
        <TextInput type="email" value={login} placeholder={translate('family_invitee_page_form_login_placeholder')} fullWidth feedbackText={showLoginError || displayLoginErrorCode
            ? translate('family_invitee_page_form_invalid_email')
            : undefined} feedbackTextId="badLoginInputError" feedbackType={showLoginError || displayLoginErrorCode ? 'error' : undefined} onChange={handleLoginChanged} disabled={false} autoFocus style={{ minHeight: 48 }} aria-describedby="badLoginInputError"/>
      </div>
      <Button nature="primary" type="submit" size="large" aria-describedby="badLoginInputError">
        {translate('family_invitee_page_form_button_title')}
      </Button>
    </form>);
};
export const Form = ({ errorCode, handleJoinFamily, handleResetErrorCode, }: FormProps) => {
    const { translate } = useTranslate();
    const displayLoginErrorCode = errorCode === 'BAD_LOGIN';
    const handleReadMoreClicked = (event: React.SyntheticEvent<HTMLElement>): void => {
        event.preventDefault();
        redirectToUrl(FEATURES_URL);
    };
    return (<JoinFamily>
      <div className={sharedStyles.joinFamilyRow}>
        <div className={sharedStyles.joinFamilyColumn}>
          <h1 className={sharedStyles.title}>
            {translate('family_invitee_page_form_heading')}
          </h1>
          <p className={sharedStyles.description}>
            {translate('family_invitee_page_form_description')}
          </p>

          <SetLoginForm handleJoinFamily={handleJoinFamily} displayLoginErrorCode={displayLoginErrorCode}/>

          <a className={sharedStyles.link} onClick={handleReadMoreClicked} href={FEATURES_URL}>
            {translate('family_invitee_page_learn_more_link_title')}
          </a>

          <PrivacyNote />
        </div>
        <div className={classnames(styles.hideOnMobile, styles.animation, sharedStyles.joinFamilyColumn, sharedStyles.mediaContainer)}>
          <Animation height={ANIMATION_SIZE} width={ANIMATION_SIZE} animationParams={{
            renderer: 'svg',
            loop: false,
            autoplay: true,
            animationData: familyAnimation,
        }}/>
        </div>
        {errorCode ? (<ErrorDialog errorCode={errorCode} resetErrorCode={handleResetErrorCode}/>) : null}
      </div>
    </JoinFamily>);
};
