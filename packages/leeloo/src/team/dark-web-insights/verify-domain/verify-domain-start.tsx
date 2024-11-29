import validator from "validator";
import { useEffect, useState } from "react";
import { carbonConnector } from "../../../libs/carbon/connector";
import {
  DomainVerificationStep,
  HelpCenterArticleCta,
  UserOpenHelpCenterEvent,
  UserVerifyDomainEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../../libs/logs/logEvent";
import { Card, Flex } from "@dashlane/design-system";
import {
  Button,
  CheckCircleIcon,
  colors,
  Heading,
  Paragraph,
  TextInput,
} from "@dashlane/ui-components";
import { VerifyDomainDialog } from "../../settings/sso-with-encryption-service/domain/VerifyDomainDialog";
import { Stepper } from "./stepper/stepper";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useUserLogin } from "../../../webapp/account/hooks/use-user-login";
import { VIEW_DOMAIN_VERIFICATION_GUIDE_LINK } from "../dark_web_insights_urls";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
const I18N_KEYS = {
  VERIFY_DOMAIN_TITLE: "team_dark_web_insights_verify_domain_title",
  VERIFY_DOMAIN_DESCRIPTION: "team_breach_report_verify_domain_description",
  VERIFY_DOMAIN_CONTINUE_TXT: "team_dwi_verify_domain_button",
  CLOSE: "_common_dialog_dismiss_button",
  REGISTER_INVALID: "team_breach_report_domain_register_invalid_error",
  CONTACT_SUPPORT: "team_settings_domain_register_contact_support",
  DOMAIN_ALREADY_EXISTS: "team_settings_domain_register_duplicated_error",
  REGISTER_FAILED_IS_PUBLIC_DOMAIN:
    "team_settings_domain_register_public_error",
  DESCRIPTION: "breach_report_verify_domain_dialog_description_markup",
  SECONDARY_DESCRIPTION:
    "breach_report_verify_domain_dialog_secondary_description",
  VIEW_DOMAIN_VERIFICATION_LABEL: "breach_report_verify_domain_href_label",
};
const ERROR_I18N_KEYS = {
  INVALID_PUBLIC_DOMAIN: I18N_KEYS.REGISTER_FAILED_IS_PUBLIC_DOMAIN,
  DOMAIN_CONTAINS_EXISTING_NONTEAM_USERS: I18N_KEYS.CONTACT_SUPPORT,
  DOMAIN_ALREADY_EXISTS: I18N_KEYS.DOMAIN_ALREADY_EXISTS,
};
interface VerifyDomainDarkWebInsightsProps {
  onSuccess: (arg: string) => void;
  onError: () => void;
}
export const VerifyDomainStart = ({
  onSuccess,
  onError,
}: VerifyDomainDarkWebInsightsProps) => {
  const { translate } = useTranslate();
  const userLogin = useUserLogin();
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const [domainName, setDomainName] = useState("");
  const [registrationError, setRegistrationError] = useState<string>("");
  const [showVerifyDomainDialog, setShowVerifyDomainDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDomainName(event.target.value);
    setRegistrationError("");
  };
  useEffect(() => {
    if (userLogin !== undefined) {
      const parsedDomain = userLogin.substring(userLogin.lastIndexOf("@") + 1);
      setDomainName(parsedDomain);
    }
  }, [userLogin]);
  const registerDomain = async (url: string) => {
    logEvent(
      new UserVerifyDomainEvent({
        domainVerificationStep:
          DomainVerificationStep.TapContinueCtaWithDomainUrl,
      })
    );
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
      return;
    }
    if (!validator.isFQDN(url)) {
      setRegistrationError(translate(I18N_KEYS.REGISTER_INVALID));
      return;
    }
    setIsLoading(true);
    const registerResult = await carbonConnector.registerTeamDomain({
      domain: url,
    });
    setIsLoading(false);
    if (registerResult.success) {
      setRegistrationError("");
      setShowVerifyDomainDialog(true);
      return;
    }
    if (!registerResult.success) {
      const {
        error: { code },
      } = registerResult;
      const errorI18nKey = ERROR_I18N_KEYS[code];
      setRegistrationError(
        translate(errorI18nKey ?? I18N_KEYS.REGISTER_INVALID)
      );
    }
  };
  return (
    <>
      <Stepper />
      <div>
        <Card sx={{ margin: "24px 0" }}>
          <Heading size="x-small">
            {translate(I18N_KEYS.VERIFY_DOMAIN_TITLE)}
          </Heading>
          <Paragraph
            sx={{ marginBottom: "20px", marginTop: "10px" }}
            color={colors.grey00}
          >
            {translate(I18N_KEYS.VERIFY_DOMAIN_DESCRIPTION)}
          </Paragraph>
          <Flex gap="16px">
            <div sx={{ width: "75%" }}>
              <TextInput
                onChange={onChange}
                fullWidth
                value={domainName}
                autoFocus
                endAdornment={
                  registrationError ||
                  domainName === "" ||
                  !validator.isFQDN(domainName) ? undefined : (
                    <CheckCircleIcon color={colors.accessibleValidatorGreen} />
                  )
                }
                feedbackText={registrationError ? registrationError : undefined}
                feedbackType={registrationError ? "error" : undefined}
              />
            </div>
            <div sx={{ width: "20%" }}>
              <Button
                type="button"
                disabled={domainName === "" || isLoading}
                onClick={() => {
                  registerDomain(domainName);
                  logEvent(
                    new UserVerifyDomainEvent({
                      domainVerificationStep:
                        DomainVerificationStep.TapContinueCtaWithDomainUrl,
                    })
                  );
                }}
              >
                {translate(I18N_KEYS.VERIFY_DOMAIN_CONTINUE_TXT)}
              </Button>
            </div>
          </Flex>
        </Card>
        {showVerifyDomainDialog ? (
          <VerifyDomainDialog
            description={translate.markup(I18N_KEYS.DESCRIPTION)}
            secondaryDescription={translate(I18N_KEYS.SECONDARY_DESCRIPTION)}
            linkLabel={translate(I18N_KEYS.VIEW_DOMAIN_VERIFICATION_LABEL)}
            href={VIEW_DOMAIN_VERIFICATION_GUIDE_LINK}
            onClick={() => {
              logEvent(
                new UserOpenHelpCenterEvent({
                  helpCenterArticleCta:
                    HelpCenterArticleCta.ViewDomainVerificationGuide,
                })
              );
            }}
            domainName={domainName}
            onSuccess={() => {
              onSuccess(domainName);
            }}
            isDarkWebInsights={true}
            onError={onError}
            onDismiss={onError}
          />
        ) : null}
      </div>
    </>
  );
};
