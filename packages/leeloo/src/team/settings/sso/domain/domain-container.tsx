import * as React from "react";
import validator from "validator";
import { Domain, DomainStatus } from "@dashlane/communication";
import { carbonConnector } from "../../../../libs/carbon/connector";
import LoadingSpinner from "../../../../libs/dashlane-style/loading-spinner";
import useTranslate from "../../../../libs/i18n/useTranslate";
import Row from "../../base-page/row";
import { SSOSettingSectionProps, SSOSettingStep } from "../types";
import { RegisterDomain } from "./steps";
import { DomainRow } from "./domain-row";
import styles from "./styles.css";
const I18N_KEYS = {
  ADDED_DOMAINS: "team_settings_domain_added",
  DOMAIN_TITLE: "team_settings_domain_title",
  DOMAIN_DESCRIPTION: "team_settings_domain_multi_description",
  REGISTER_INVALID: "team_settings_domain_register_invalid_error",
  CONTACT_SUPPORT: "team_settings_domain_register_contact_support",
  REGISTER_FAILED_IS_PUBLIC_DOMAIN:
    "team_settings_domain_register_public_error",
  GET_DOMAIN_ERROR: "team_settings_domain_fetch_error",
};
const ERROR_I18N_KEYS = {
  INVALID_PUBLIC_DOMAIN: I18N_KEYS.REGISTER_FAILED_IS_PUBLIC_DOMAIN,
  DOMAIN_CONTAINS_EXISTING_NONTEAM_USERS: I18N_KEYS.CONTACT_SUPPORT,
};
const MAX_DOMAINS = 5;
export enum DomainSteps {
  Register,
  Verify,
  VerifyFailed,
  Complete,
}
export const DomainContainer = ({
  isTeamSettingsLoading,
  teamSettings,
  setStepComplete,
  uncompleteSteps,
}: SSOSettingSectionProps &
  Required<Pick<SSOSettingSectionProps, "uncompleteSteps">>) => {
  const { translate } = useTranslate();
  const [isDomainDataLoading, setIsDomainDataLoading] = React.useState(false);
  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [registrationError, setRegistrationError] = React.useState<string>("");
  const [domainLoadError, setDomainLoadError] = React.useState<string>("");
  const [currentSteps, setCurrentSteps] = React.useState<
    Record<string, DomainSteps>
  >({});
  const isDomainVerified = (domain: Domain) => domain.status === "valid";
  const getVerifiedDomains = () =>
    domains.filter((domain) => isDomainVerified(domain));
  const ssoEnabled = teamSettings?.ssoEnabled || false;
  const updateDomainsState = React.useCallback((domains: Domain[] = []) => {
    domains.forEach((domain) => {
      switch (domain.status) {
        case DomainStatus.pending:
          setCurrentSteps((prevState) => ({
            ...prevState,
            [domain.id]: DomainSteps.Verify,
          }));
          setStepComplete(SSOSettingStep.ClaimDomain);
          break;
        case DomainStatus.valid:
          setCurrentSteps((prevState) => ({
            ...prevState,
            [domain.id]: DomainSteps.Complete,
          }));
          setStepComplete(SSOSettingStep.ClaimDomain);
          setStepComplete(SSOSettingStep.VerifyDomain);
          break;
        default:
          setCurrentSteps((prevState) => ({
            ...prevState,
            [domain.id]: DomainSteps.Register,
          }));
          break;
      }
    });
  }, []);
  const getDomains = React.useCallback(async (): Promise<
    Domain[] | undefined
  > => {
    setIsDomainDataLoading(true);
    setDomainLoadError("");
    const result = await carbonConnector.getTeamDomains();
    setIsDomainDataLoading(false);
    if (result.success) {
      setDomains(result.domains);
      return result.domains;
    }
    setDomainLoadError(translate(I18N_KEYS.GET_DOMAIN_ERROR));
    return Promise.resolve(undefined);
  }, [carbonConnector.getTeamDomains]);
  const registerDomain = async (url: string) => {
    if (domains.length >= MAX_DOMAINS) {
      return;
    }
    if (!validator.isFQDN(url)) {
      setRegistrationError(translate(I18N_KEYS.REGISTER_INVALID));
      return;
    }
    const registerResult = await carbonConnector.registerTeamDomain({
      domain: url,
    });
    if (registerResult.success) {
      updateDomainsState(await getDomains());
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
  const verifyDomain = async (domain: Domain) => {
    const verification = await carbonConnector.completeTeamDomainRegistration();
    const isSuccessful =
      verification.success &&
      verification.domains.find(
        (domainResp) => domainResp.name === domain.name
      ) &&
      verification.domains.find((domainResp) => domainResp.name === domain.name)
        ?.status === DomainStatus.valid;
    if (isSuccessful) {
      setStepComplete(SSOSettingStep.VerifyDomain);
      setCurrentSteps((prevState) => ({
        ...prevState,
        [domain.id]: DomainSteps.Complete,
      }));
    } else {
      setCurrentSteps((prevState) => ({
        ...prevState,
        [domain.id]: DomainSteps.VerifyFailed,
      }));
    }
  };
  const deactivateDomain = async (domain: Domain) => {
    if (!domain) {
      return;
    }
    const result = await carbonConnector.deactivateTeamDomain({
      domain: domain.name,
    });
    if (result.success) {
      updateDomainsState(await getDomains());
      if (!getVerifiedDomains().length) {
        uncompleteSteps([
          SSOSettingStep.EnableSSO,
          SSOSettingStep.SSOConnector,
          SSOSettingStep.ClaimDomain,
          SSOSettingStep.VerifyDomain,
        ]);
      }
    }
  };
  React.useEffect(() => {
    const loadDomains = async () => {
      updateDomainsState(await getDomains());
    };
    loadDomains();
  }, [getDomains, updateDomainsState]);
  return (
    <>
      <Row
        label={`1. ${translate(I18N_KEYS.DOMAIN_TITLE)}`}
        labelHelper={translate(I18N_KEYS.DOMAIN_DESCRIPTION)}
      >
        {isDomainDataLoading || isTeamSettingsLoading ? (
          <LoadingSpinner size={20} containerStyle={{ alignItems: "normal" }} />
        ) : (
          <RegisterDomain
            registerDomain={registerDomain}
            domainLoadError={domainLoadError}
            registrationError={registrationError}
            disabled={domains.length >= MAX_DOMAINS}
            clearRegistrationErrors={() => setRegistrationError("")}
          />
        )}
      </Row>
      {isDomainDataLoading ||
      isTeamSettingsLoading ||
      domains.length === 0 ? null : (
        <Row label={translate(I18N_KEYS.ADDED_DOMAINS)}>
          <div className={styles.domainsContainer}>
            {domains.map((domain, index) =>
              index < MAX_DOMAINS ? (
                <DomainRow
                  key={domain.id}
                  currentStep={currentSteps[domain.id]}
                  deactivateDomain={deactivateDomain}
                  domain={domain}
                  isDisabled={
                    ssoEnabled &&
                    getVerifiedDomains().length === 1 &&
                    isDomainVerified(domain)
                  }
                  setCurrentSteps={setCurrentSteps}
                  verifyDomain={verifyDomain}
                />
              ) : null
            )}
          </div>
        </Row>
      )}
    </>
  );
};
