import { ChangeEvent, FocusEvent, useEffect, useState } from "react";
import {
  Badge,
  BadgeProps,
  Button,
  Icon,
  TextField,
} from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  confidentialSSOApi,
  DomainVerificationInfo,
  DomainVerificationStatus,
} from "@dashlane/sso-scim-contracts";
import { GridChild } from "@dashlane/ui-components";
import { isFailure } from "@dashlane/framework-types";
import { getError, I18N_KEYS as I18N_ERROR_KEYS } from "./domain-error-helpers";
import useTranslate from "../../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  SSO_STATUS_ACTIVE: "sso_confidential_verify_domain_step_sso_status_active",
  SSO_STATUS_VERIFIED:
    "sso_confidential_verify_domain_step_sso_status_verified",
  SSO_STATUS_UNVERIFIED:
    "sso_confidential_verify_domain_step_sso_status_unverified",
  SSO_STATUS_ERROR: "sso_confidential_verify_domain_step_sso_status_error",
  INPUT_LABEL: "sso_confidential_verify_domain_step_domain_input_label",
  BUTTON_DELETE_LABEL: "_common_action_delete",
  BUTTON_VERIFY_LABEL:
    "sso_confidential_verify_domain_step_domain_input_button_verify",
  BUTTON_VIEW_DETAILS_LABEL:
    "sso_confidential_verify_domain_step_domain_input_button_view_details",
  ERROR_DOMAIN_ALREADY_PROVISIONED:
    "sso_confidential_verify_domain_error_domain_already_provisioned",
  FEEDBACK_SSO_ACTIVE:
    "sso_confidential_verify_domain_step_domain_input_feedback_sso_active",
  ...I18N_ERROR_KEYS,
};
type DomainStatusBadgeProps = {
  error: boolean;
  isValid: boolean;
  isValidSSOActive: boolean;
};
export type DomainRowProps = {
  disabled: boolean;
  domainName: string;
  domainVerificationInfo?: DomainVerificationInfo;
  id: string;
  onDeleteDomain: () => void;
  onModalOpen: () => void;
  onUpdateDomain: (domainName: string) => void;
  provisionedDomains: Map<string, string>;
  ssoActive: boolean;
};
const DomainStatusBadge = ({
  error,
  isValid,
  isValidSSOActive,
}: DomainStatusBadgeProps) => {
  const { translate } = useTranslate();
  const renderBadge = (
    mood: BadgeProps["mood"],
    intensity: BadgeProps["intensity"],
    label: string
  ) => <Badge mood={mood} intensity={intensity} label={translate(label)} />;
  if (isValidSSOActive) {
    return renderBadge("positive", "catchy", I18N_KEYS.SSO_STATUS_ACTIVE);
  }
  if (isValid) {
    return renderBadge("positive", "quiet", I18N_KEYS.SSO_STATUS_VERIFIED);
  }
  if (error) {
    return renderBadge("danger", "quiet", I18N_KEYS.SSO_STATUS_ERROR);
  }
  return renderBadge("neutral", "quiet", I18N_KEYS.SSO_STATUS_UNVERIFIED);
};
const getFeedback = (
  error: string | null,
  isDuplicate: boolean,
  isValidSSOActive: boolean
) => {
  if (isDuplicate) {
    return I18N_KEYS.ERROR_DOMAIN_ALREADY_PROVISIONED;
  }
  if (error) {
    return error;
  }
  if (isValidSSOActive) {
    return I18N_KEYS.FEEDBACK_SSO_ACTIVE;
  }
  return null;
};
export const DomainRow = ({
  disabled,
  domainName,
  domainVerificationInfo,
  id,
  onModalOpen,
  onDeleteDomain,
  onUpdateDomain,
  provisionedDomains,
  ssoActive,
}: DomainRowProps) => {
  const { translate } = useTranslate();
  const { provisionDomain, deleteDomain } =
    useModuleCommands(confidentialSSOApi);
  const [verifyInProgress, setVerifyInProgress] = useState<boolean>(false);
  const [deleteInProgress, setDeleteInProgress] = useState<boolean>(false);
  const [isInputEmpty, setIsInputEmpty] = useState<boolean>(
    domainName.length === 0
  );
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isProvisioned = provisionedDomains.get(domainName) === id;
  const isValid =
    isProvisioned &&
    domainVerificationInfo?.verificationStatus ===
      DomainVerificationStatus.enum.valid;
  const isValidSSOActive = isValid && ssoActive;
  useEffect(() => {
    if (!isProvisioned && provisionedDomains.has(domainName)) {
      setIsDuplicate(true);
    } else if (domainVerificationInfo) {
      setError(getError(domainVerificationInfo)?.title ?? null);
    }
  }, [domainName, domainVerificationInfo, isProvisioned, provisionedDomains]);
  const feedback = getFeedback(error, isDuplicate, isValidSSOActive);
  const onInputChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setIsDuplicate(false);
    setError(null);
    setIsInputEmpty(value.length === 0);
  };
  const onInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    onUpdateDomain(event.currentTarget.value.trim().toLocaleLowerCase());
  };
  const handleProvisionDomain = async () => {
    try {
      if (!domainVerificationInfo && !error) {
        setVerifyInProgress(true);
        const result = await provisionDomain({ domainName });
        if (isFailure(result)) {
          if (result.error.tag === "DomainAlreadyProvisioned") {
            setIsDuplicate(true);
            return;
          }
          setError(I18N_KEYS.ERROR_SSO_GENERIC);
          return;
        }
      }
      onModalOpen();
    } catch {
      setError(I18N_KEYS.ERROR_SSO_GENERIC);
    } finally {
      setVerifyInProgress(false);
    }
  };
  const handleDeleteDomain = async () => {
    try {
      if (domainVerificationInfo && !isDuplicate) {
        setDeleteInProgress(true);
        const result = await deleteDomain({ domainName });
        if (isFailure(result)) {
          setError(I18N_KEYS.ERROR_SSO_GENERIC);
          return;
        }
      }
      onDeleteDomain();
    } catch {
      setError(I18N_KEYS.ERROR_SSO_GENERIC);
    } finally {
      setDeleteInProgress(false);
    }
  };
  return (
    <>
      <GridChild
        alignSelf="start"
        justifySelf="start"
        sx={{ paddingTop: "16px" }}
      >
        <DomainStatusBadge
          error={
            !!error ||
            isDuplicate ||
            domainVerificationInfo?.verificationStatus ===
              DomainVerificationStatus.enum.expired ||
            domainVerificationInfo?.verificationStatus ===
              DomainVerificationStatus.enum.invalid
          }
          isValid={isValid}
          isValidSSOActive={isValidSSOActive}
        />
      </GridChild>
      <GridChild>
        <TextField
          label={translate(I18N_KEYS.INPUT_LABEL)}
          placeholder={translate(I18N_KEYS.INPUT_LABEL)}
          labelPersists={false}
          autoCorrect="off"
          autoComplete="off"
          disabled={disabled}
          readOnly={isProvisioned}
          onChange={onInputChange}
          onBlur={onInputBlur}
          value={domainName}
          sx={{ width: "400px" }}
          error={isDuplicate || !!error}
          feedback={feedback ? translate(feedback) : undefined}
        />
      </GridChild>

      <GridChild
        alignSelf="start"
        justifySelf="end"
        sx={{ paddingTop: "5px" }}
        {...(isValidSSOActive && {
          gridColumnStart: "3",
          gridColumnEnd: "5",
        })}
      >
        {isValid && !isDuplicate ? (
          <Button
            mood="neutral"
            intensity="quiet"
            onClick={onModalOpen}
            disabled={disabled}
          >
            {translate(I18N_KEYS.BUTTON_VIEW_DETAILS_LABEL)}
          </Button>
        ) : (
          <Button
            mood="brand"
            intensity="quiet"
            disabled={
              disabled || isInputEmpty || isDuplicate || deleteInProgress
            }
            isLoading={verifyInProgress}
            onClick={handleProvisionDomain}
            sx={{ position: "relative" }}
          >
            {translate(I18N_KEYS.BUTTON_VERIFY_LABEL)}
          </Button>
        )}
      </GridChild>

      {!isValidSSOActive ? (
        <GridChild
          alignSelf="start"
          justifySelf="end"
          sx={{ paddingTop: "5px" }}
        >
          <Button
            aria-label={I18N_KEYS.BUTTON_DELETE_LABEL}
            disabled={verifyInProgress}
            isLoading={deleteInProgress}
            mood="danger"
            intensity="supershy"
            layout="iconOnly"
            icon={<Icon name="ActionDeleteOutlined" />}
            onClick={handleDeleteDomain}
            sx={{ position: "relative" }}
          />
        </GridChild>
      ) : null}

      <GridChild
        gridColumnStart={1}
        gridColumnEnd={5}
        sx={{ borderBottom: "1px solid ds.border.neutral.quiet.idle" }}
      />
    </>
  );
};
