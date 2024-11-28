import { memo } from "react";
import {
  Button,
  DisplayArea,
  DisplayField,
  Icon,
  jsx,
  useToast,
} from "@dashlane/design-system";
import { Credential, VaultItemType } from "@dashlane/vault-contracts";
import { Field } from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsUserFrozen } from "../../../../libs/hooks/use-is-user-frozen";
import { useCopyAction } from "./useCopyAction";
import { LinkedWebsitesCount } from "./linked-websites-count/linked-websites-count";
import { openCredentialWebsite } from "../helpers";
import { OTP } from "./form-fields/OTP/OTP";
import { PasswordField } from "./form-fields/password-field";
import { FormContainer } from "../common/form-container";
import { CopyIconButton } from "./form-fields/copy-icon-button";
export const I18N_KEYS = {
  EMAIL_COPIED: "tab/all_items/credential/actions/email_copied_to_clipboard",
  LOGIN_COPIED: "tab/all_items/credential/actions/login_copied_to_clipboard",
  SECONDARY_LOGIN_COPIED:
    "tab/all_items/credential/actions/secondary_login_copied_to_clipboard",
  NOTE_COPIED: "tab/all_items/credential/actions/note_copied_to_clipboard",
  EMAIL_LABEL: "tab/all_items/credential/view/label/email",
  EMAIL_COPY: "tab/all_items/credential/view/action/copy_email",
  LOGIN_LABEL: "tab/all_items/credential/view/label/login",
  LOGIN_COPY: "tab/all_items/credential/view/action/copy_login",
  SECONDARY_LOGIN_LABEL: "tab/all_items/credential/view/label/secondary_login",
  SECONDARY_LOGIN_COPY:
    "tab/all_items/credential/view/action/copy_secondary_login",
  WEBSITE_LABEL: "tab/all_items/credential/view/label/website",
  WEBSITE_OPEN: "tab/all_items/credential/view/action/go_to_website",
  WEBSITE_OPEN_A11Y: "tab/all_items/credential/view/action/go_to_website_a11y",
  LINKED_WEBSITE_COUNT_SINGLE:
    "tab/all_items/credential/view/sublabel/linked_websites_one_item",
  LINKED_WEBSITE_COUNT_MULTI:
    "tab/all_items/credential/view/sublabel/linked_websites_count",
  LINKED_WEBSITES_TITLE: "tab/all_items/credential/linked_websites_view/title",
  NOTE_LABEL: "tab/all_items/credential/view/label/note",
  NOTE_COPY: "tab/all_items/credential/view/action/copy_note",
};
interface CredentialDetailFormProps {
  credential: Credential;
  shouldItemBeVisible: boolean;
  dashlaneDefinedLinkedWebsites: string[];
  openLinkedWebsites: () => void;
}
const CredentialDetailFormComponent = ({
  credential,
  shouldItemBeVisible,
  dashlaneDefinedLinkedWebsites,
  openLinkedWebsites,
}: CredentialDetailFormProps) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { isCopyDisabled } = useIsUserFrozen();
  const numberOfUserAddedLinkedWebsites = credential.linkedURLs.length;
  const numberOfDashlaneAddedLinkedWebsites =
    dashlaneDefinedLinkedWebsites.length;
  let totalNumberOfLinkedWebsites = 0;
  if (numberOfDashlaneAddedLinkedWebsites > 1) {
    totalNumberOfLinkedWebsites =
      numberOfDashlaneAddedLinkedWebsites + numberOfUserAddedLinkedWebsites;
  } else {
    totalNumberOfLinkedWebsites = numberOfUserAddedLinkedWebsites;
  }
  const linkedWebsitesTranslation =
    totalNumberOfLinkedWebsites === 1
      ? translate(I18N_KEYS.LINKED_WEBSITE_COUNT_SINGLE)
      : translate(I18N_KEYS.LINKED_WEBSITE_COUNT_MULTI, {
          count: totalNumberOfLinkedWebsites,
        });
  const emailCopyAction = useCopyAction({
    toastString: translate(I18N_KEYS.EMAIL_COPIED),
    showToast,
    itemType: VaultItemType.Credential,
    field: Field.Email,
    itemId: credential.id,
    itemUrl: credential.URL,
    isProtected: false,
    value: credential.email,
  });
  const loginCopyAction = useCopyAction({
    toastString: translate(I18N_KEYS.LOGIN_COPIED),
    showToast,
    itemType: VaultItemType.Credential,
    field: Field.Login,
    itemId: credential.id,
    itemUrl: credential.URL,
    isProtected: false,
    value: credential.username,
  });
  const secondaryLoginCopyAction = useCopyAction({
    toastString: translate(I18N_KEYS.SECONDARY_LOGIN_COPIED),
    showToast,
    itemType: VaultItemType.Credential,
    field: Field.SecondaryLogin,
    itemId: credential.id,
    itemUrl: credential.URL,
    isProtected: false,
    value: credential.alternativeUsername ?? "",
  });
  const noteCopyAction = useCopyAction({
    toastString: translate(I18N_KEYS.NOTE_COPIED),
    showToast,
    itemType: VaultItemType.Credential,
    field: Field.Note,
    itemId: credential.id,
    itemUrl: credential.URL,
    isProtected: false,
    value: credential.note ?? "",
  });
  return (
    <FormContainer>
      {credential.email ? (
        <DisplayField
          data-name="email"
          label={translate(I18N_KEYS.EMAIL_LABEL)}
          value={credential.email}
          actions={[
            <CopyIconButton
              key="copy-button"
              text={translate(I18N_KEYS.EMAIL_COPY)}
              copyAction={() => {
                void emailCopyAction();
              }}
            />,
          ]}
        />
      ) : null}
      {credential.username ? (
        <DisplayField
          data-name="login"
          label={translate(I18N_KEYS.LOGIN_LABEL)}
          value={credential.username}
          actions={[
            <CopyIconButton
              key="copy-button"
              text={translate(I18N_KEYS.LOGIN_COPY)}
              copyAction={() => {
                void loginCopyAction();
              }}
            />,
          ]}
        />
      ) : null}
      {credential.alternativeUsername ? (
        <DisplayField
          data-name="secondary_login"
          label={translate(I18N_KEYS.SECONDARY_LOGIN_LABEL)}
          value={credential.alternativeUsername}
          actions={[
            <CopyIconButton
              key="copy-button"
              text={translate(I18N_KEYS.SECONDARY_LOGIN_COPY)}
              copyAction={() => {
                void secondaryLoginCopyAction();
              }}
            />,
          ]}
        />
      ) : null}
      {credential.password ? (
        <PasswordField
          isCopyDisabled={isCopyDisabled}
          credential={credential}
          shouldItemBeVisible={shouldItemBeVisible}
        />
      ) : null}
      {credential.otpURL || credential.otpSecret ? (
        <OTP credentialUrl={credential.URL} credentialId={credential.id} />
      ) : null}
      {credential.URL ? (
        <DisplayField
          data-name="website"
          label={translate(I18N_KEYS.WEBSITE_LABEL)}
          value={credential.URL}
          actions={[
            <Button
              key="go-to-website"
              data-testid="go-to-website-button"
              title={translate(I18N_KEYS.WEBSITE_LABEL)}
              tooltip={translate(I18N_KEYS.WEBSITE_LABEL)}
              aria-label={translate(I18N_KEYS.WEBSITE_LABEL)}
              icon={<Icon name="ActionOpenExternalLinkOutlined" />}
              intensity="supershy"
              layout="iconOnly"
              onClick={() => {
                void openCredentialWebsite(credential.id, credential.URL);
              }}
            />,
          ]}
        />
      ) : null}
      {credential.linkedURLs && totalNumberOfLinkedWebsites ? (
        <LinkedWebsitesCount
          linkedWebsitesTitle={translate(I18N_KEYS.LINKED_WEBSITES_TITLE)}
          value={linkedWebsitesTranslation}
          onClick={() => openLinkedWebsites()}
        />
      ) : null}
      {credential.note ? (
        <DisplayArea
          data-name="note"
          label={translate(I18N_KEYS.NOTE_LABEL)}
          value={credential.note}
          actions={[
            <CopyIconButton
              key="copy-button"
              text={translate(I18N_KEYS.NOTE_COPY)}
              copyAction={() => {
                void noteCopyAction();
              }}
            />,
          ]}
        />
      ) : null}
    </FormContainer>
  );
};
export const CredentialDetailForm = memo(CredentialDetailFormComponent);
