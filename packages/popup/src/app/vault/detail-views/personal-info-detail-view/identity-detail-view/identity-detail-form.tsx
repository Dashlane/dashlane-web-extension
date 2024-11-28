import { memo } from "react";
import { DisplayField, jsx } from "@dashlane/design-system";
import { Identity, IdentityTitle } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { parseDate } from "../../../active-tab-list/lists/personal-info-list/identities/identity-list-item";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { I18N_SHARED_KEY } from "../../../utils/shared-translation";
import { FormContainer } from "../../common/form-container";
const I18N_KEYS = {
  TITLE_LABEL: "tab/all_items/personalinfo/identity/view/label/title",
  LASTNAME_LABEL: "tab/all_items/personalinfo/identity/view/label/lastname",
  LASTNAME2_LABEL: "tab/all_items/personalinfo/identity/view/label/lastname2",
  MIDDLENAME_LABEL: "tab/all_items/personalinfo/identity/view/label/middlename",
  FIRSTNAME_LABEL: "tab/all_items/personalinfo/identity/view/label/firstname",
  USERNAME_LABEL: "tab/all_items/personalinfo/identity/view/label/username",
  BIRTHDATE_LABEL: "tab/all_items/personalinfo/identity/view/label/birthdate",
  BIRTHPLACE_LABEL: "tab/all_items/personalinfo/identity/view/label/birthplace",
};
const I18N_TITLE_KEYS: Record<IdentityTitle, string> = {
  [IdentityTitle.Mr]: "tab/all_items/personalinfo/identity/view/title/mr",
  [IdentityTitle.Mrs]: "tab/all_items/personalinfo/identity/view/title/mme",
  [IdentityTitle.Miss]: "tab/all_items/personalinfo/identity/view/title/mlle",
  [IdentityTitle.Ms]: "tab/all_items/personalinfo/identity/view/title/ms",
  [IdentityTitle.Mx]: "tab/all_items/personalinfo/identity/view/title/mx",
  [IdentityTitle.NoneOfThese]:
    "tab/all_items/personalinfo/identity/view/title/none_of_these",
};
interface IdentityDetailFormProps {
  identity: Identity;
}
const IdentityDetailFormComponent = ({ identity }: IdentityDetailFormProps) => {
  const { translate, getLocaleMeta } = useTranslate();
  const {
    birthDate,
    birthPlace,
    firstName,
    lastName,
    lastName2,
    middleName,
    pseudo,
    spaceId,
    title,
  } = identity;
  return (
    <FormContainer>
      {title && (
        <DisplayField
          id="title"
          label={translate(I18N_KEYS.TITLE_LABEL)}
          value={translate(I18N_TITLE_KEYS[title])}
        />
      )}
      {firstName && (
        <DisplayField
          id="firstName"
          label={translate(I18N_KEYS.FIRSTNAME_LABEL)}
          value={firstName}
        />
      )}
      {middleName && (
        <DisplayField
          id="middleName"
          label={translate(I18N_KEYS.MIDDLENAME_LABEL)}
          value={middleName}
        />
      )}
      {lastName && (
        <DisplayField
          id="lastName"
          label={translate(I18N_KEYS.LASTNAME_LABEL)}
          value={lastName}
        />
      )}
      {lastName2 && (
        <DisplayField
          id="lastName2"
          label={translate(I18N_KEYS.LASTNAME2_LABEL)}
          value={lastName2}
        />
      )}
      {pseudo && (
        <DisplayField
          id="pseudo"
          label={translate(I18N_KEYS.USERNAME_LABEL)}
          value={pseudo}
        />
      )}
      {birthDate && (
        <DisplayField
          id="birthDate"
          label={translate(I18N_KEYS.BIRTHDATE_LABEL)}
          value={Intl.DateTimeFormat(getLocaleMeta()?.code).format(
            parseDate(birthDate)
          )}
        />
      )}
      {birthPlace && (
        <DisplayField
          id="birthPlace"
          label={translate(I18N_KEYS.BIRTHPLACE_LABEL)}
          value={birthPlace}
        />
      )}
      {spaceId && (
        <SpaceName
          id="identityIdSpace"
          label={translate(I18N_SHARED_KEY.SPACE)}
          spaceId={spaceId}
        />
      )}
    </FormContainer>
  );
};
export const IdentityDetailForm = memo(IdentityDetailFormComponent);
