import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { TermsSubmitOptions } from "../terms/terms";
import useTranslate from "../../libs/i18n/useTranslate";
import { TextField } from "../../libs/dashlane-style/text-field/text-field";
import Checkbox from "../../libs/dashlane-style/checkbox";
import PrimaryButton from "../../libs/dashlane-style/buttons/modern/primary";
import LoadingSpinner from "../../libs/dashlane-style/loading-spinner";
import consentStyles from "./new-user-consent-fields.css";
export interface NewUserConsentFieldsProps {
  error: string;
  isEu: boolean | null;
  memberEmail: string;
  onSubmit: (acceptOptions: TermsSubmitOptions) => Promise<void>;
}
export const NewUserConsentFields = ({
  error,
  isEu,
  memberEmail,
  onSubmit,
}: NewUserConsentFieldsProps) => {
  const isLoadingUserLocation = isEu === null;
  const userIsEu = React.useCallback(
    () => Boolean(isLoadingUserLocation ? true : isEu),
    [isEu, isLoadingUserLocation]
  );
  const { translate } = useTranslate();
  const [isSubscribed, setIsSubscribed] = useState(!userIsEu());
  const [isConsentAccepted, setIsConsentAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const infoEmailInput = React.createRef<TextField>();
  useEffect(() => {
    setIsSubscribed(!userIsEu());
  }, [setIsSubscribed, userIsEu]);
  const toggleEmailsTipsAndOffersChanged = () => {
    setIsSubscribed(!isSubscribed);
  };
  const toggleConsentChanged = () => {
    setIsConsentAccepted(!isConsentAccepted);
  };
  const isSubmitDisabled = () => {
    return userIsEu() && !isConsentAccepted;
  };
  const handleAcceptFormSubmitted = () => {
    const acceptOptions: TermsSubmitOptions = {
      privacyPolicyAndToS: isConsentAccepted,
      subscribed: isSubscribed,
      isEu: userIsEu(),
      setIsLoading,
    };
    onSubmit(acceptOptions);
  };
  const emailsTipsAndOffersLabel = userIsEu()
    ? translate("member_account_creation_info_tips_and_offers_label")
    : translate("member_account_creation_i_want_to_receive_spam_and_ads");
  return (
    <div className={consentStyles.inner}>
      <h1
        className={classnames(
          consentStyles.heading,
          consentStyles.acceptHeading
        )}
      >
        {translate("member_account_creation_accept_content_heading")}
      </h1>
      {!isLoadingUserLocation ? (
        <form className={consentStyles.form}>
          <TextField
            isDisabled
            placeholder={translate("member_account_creation_email_hint_text")}
            labelText={translate(
              "member_account_creation_email_floating_label"
            )}
            ref={infoEmailInput}
            defaultValue={memberEmail}
          />

          {error ? (
            <div className={consentStyles.errorText}>{error}</div>
          ) : null}

          <div
            className={classnames(
              consentStyles.disclaimerCheckboxWrapper,
              consentStyles.visible,
              consentStyles.consentCheckbox
            )}
          >
            <Checkbox
              label={emailsTipsAndOffersLabel}
              labelClass={consentStyles.disclaimerCheckbox}
              name="emailsTipsAndOffers"
              onCheck={toggleEmailsTipsAndOffersChanged}
              checked={isSubscribed}
            />
          </div>
          {userIsEu() && (
            <div
              className={classnames(
                consentStyles.disclaimerCheckboxWrapper,
                consentStyles.visible
              )}
            >
              <Checkbox
                label={
                  <>
                    {translate.markup(
                      "account_creation_confirm_terms_of_service_markup"
                    )}
                  </>
                }
                labelClass={consentStyles.disclaimerCheckbox}
                name="termsAndConditions"
                onCheck={toggleConsentChanged}
                checked={isConsentAccepted}
              />
            </div>
          )}
          <div className={consentStyles.formAction}>
            <PrimaryButton
              size="large"
              label={translate("member_account_creation_accept_next")}
              disabled={Boolean(isSubmitDisabled())}
              onClick={handleAcceptFormSubmitted}
              loading={isLoading}
              classNames={[consentStyles.nextButton]}
            />
          </div>
          {!userIsEu() ? (
            <p className={consentStyles.disclaimer}>
              {translate.markup(
                "member_account_creation_accept_tos_markup",
                {},
                { linkTarget: "_blank" }
              )}
            </p>
          ) : null}
        </form>
      ) : (
        <LoadingSpinner size={40} />
      )}
    </div>
  );
};
