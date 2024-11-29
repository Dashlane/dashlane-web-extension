import { useEffect, useState } from "react";
import { Dialog, Infobox, Paragraph } from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { isFailure } from "@dashlane/framework-types";
import {
  confidentialSSOApi,
  DomainVerificationInfo,
  DomainVerificationStatus,
} from "@dashlane/sso-scim-contracts";
import {
  DomainError,
  getError,
  I18N_KEYS as I18N_ERROR_KEYS,
} from "./domain-error-helpers";
import useTranslate from "../../../libs/i18n/useTranslate";
import { InputWithCopyButton } from "../../../libs/dashlane-style/text-input-with-action-button/input-with-copy-button.ds";
export const I18N_KEYS = {
  CLOSE: "_common_dialog_dismiss_button",
  TITLE: "sso_confidential_verify_domain_modal_title",
  SUBDOMAIN_LABEL: "sso_confidential_verify_domain_modal_subdomain_label",
  TXT_LABEL: "sso_confidential_verify_domain_modal_txt_label",
  INSTRUCTION_1: "sso_confidential_verify_domain_modal_instruction_1",
  INSTRUCTION_2: "sso_confidential_verify_domain_modal_instruction_2",
  INSTUCTION_3: "sso_confidential_verify_domain_modal_instruction_3_markup",
  INFOBOX_TITLE: "sso_confidential_verify_domain_modal_infobox_title",
  VERIFY_DOMAIN_BUTTON:
    "sso_confidential_verify_domain_modal_verify_domain_button",
  VERIFY_DOMAIN_BUTTON_RETRY:
    "sso_confidential_verify_domain_modal_verify_domain_button_retry",
  VERIFY_DOMAIN_CLOSE:
    "sso_confidential_verify_domain_modal_verify_domain_button_close",
  ...I18N_ERROR_KEYS,
};
type DomainDetailModalProps = {
  domainName: string;
  domainVerificationInfo: DomainVerificationInfo;
  onClose: () => void;
};
export const DomainDetailModal = ({
  domainName,
  domainVerificationInfo,
  onClose,
}: DomainDetailModalProps) => {
  const { translate } = useTranslate();
  const { checkDNSValidation } = useModuleCommands(confidentialSSOApi);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verifyDomainSuccess, setVerifyDomainSuccess] =
    useState<boolean>(false);
  const [error, setError] = useState<DomainError | null>(null);
  useEffect(() => {
    if (
      domainVerificationInfo?.verificationStatus ===
        DomainVerificationStatus.enum.valid &&
      verifyDomainSuccess
    ) {
      onClose();
    }
  }, [domainVerificationInfo, verifyDomainSuccess]);
  useEffect(() => {
    if (domainVerificationInfo) {
      setError(getError(domainVerificationInfo));
    }
  }, [domainVerificationInfo]);
  const verifyDomain = async () => {
    setIsLoading(true);
    const result = await checkDNSValidation({ domainName });
    setIsLoading(false);
    if (isFailure(result)) {
      setError({ title: I18N_KEYS.ERROR_SSO_GENERIC });
      return;
    }
    setVerifyDomainSuccess(true);
  };
  const { pendingReason, subdomainValue, txtValue, verificationStatus } =
    domainVerificationInfo;
  let buttonCopy = translate(I18N_KEYS.VERIFY_DOMAIN_BUTTON);
  if (verificationStatus === "valid") {
    buttonCopy = translate(I18N_KEYS.VERIFY_DOMAIN_CLOSE);
  } else if (
    (verificationStatus === "pending" && pendingReason) ||
    verificationStatus === "invalid"
  ) {
    buttonCopy = translate(I18N_KEYS.VERIFY_DOMAIN_BUTTON_RETRY);
  }
  return (
    <Dialog
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      title={translate(I18N_KEYS.TITLE, { domainName })}
      isOpen={true}
      onClose={onClose}
      actions={{
        primary: {
          children: buttonCopy,
          onClick: verificationStatus === "valid" ? onClose : verifyDomain,
          isLoading,
        },
      }}
    >
      <ol
        sx={{
          listStyleType: "decimal",
          ml: "20px",
        }}
      >
        <Paragraph
          as="li"
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.standard"
        >
          {translate(I18N_KEYS.INSTRUCTION_1)}
        </Paragraph>
        <Paragraph
          as="li"
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.standard"
        >
          {translate(I18N_KEYS.INSTRUCTION_2)}
        </Paragraph>
        <Paragraph
          as="li"
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.standard"
        >
          {translate.markup(I18N_KEYS.INSTUCTION_3)}
        </Paragraph>
      </ol>
      <Infobox title={translate(I18N_KEYS.INFOBOX_TITLE)} mood="brand" />
      <InputWithCopyButton
        label={translate(I18N_KEYS.SUBDOMAIN_LABEL)}
        value={subdomainValue ?? ""}
        readOnly
      />
      <InputWithCopyButton
        label={translate(I18N_KEYS.TXT_LABEL)}
        value={txtValue ?? ""}
        readOnly
      />
      {error ? (
        <Infobox
          title={translate(error.title)}
          description={
            error.data || (error.description && translate(error.description))
          }
          mood="danger"
          size="medium"
        />
      ) : null}
    </Dialog>
  );
};
