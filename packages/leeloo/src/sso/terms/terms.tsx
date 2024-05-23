import { jsx } from '@dashlane/design-system';
import { StandardHeader } from 'libs/dashlane-style/standard-header/standard-header';
import { redirect } from 'libs/router';
import { ACCOUNT_CREATION_URL_SEGMENT } from 'app/routes/constants';
import { NewUserConsentFields } from 'sso/new-user-consent-fields/new-user-consent-fields';
import termsStyles from './terms.css';
export interface TermsSubmitOptions {
    privacyPolicyAndToS: boolean;
    subscribed: boolean;
    isEu: boolean;
    setIsLoading: (isLoading: boolean) => void;
}
export interface TermsProps {
    error: string;
    memberEmail: string;
    onSubmit: (acceptOptions: TermsSubmitOptions) => Promise<void>;
    isEu: boolean | null;
}
export const Terms = (props: TermsProps) => {
    const { ...newUserFieldsProps } = props;
    const customClasses = {
        standardHeader: termsStyles.standardHeader,
        logoContainer: termsStyles.logoContainer,
        logo: termsStyles.logo,
    };
    const logoComponent = APP_PACKAGED_IN_EXTENSION ? (<div onClick={() => redirect(ACCOUNT_CREATION_URL_SEGMENT)}/>) : null;
    return (<div className={termsStyles.wrapper}>
      <StandardHeader classes={customClasses} logoComponent={logoComponent}/>
      <div className={termsStyles.content}>
        <NewUserConsentFields {...newUserFieldsProps}/>
      </div>
    </div>);
};
