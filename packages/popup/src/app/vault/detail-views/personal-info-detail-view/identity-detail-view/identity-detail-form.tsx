import { memo } from 'react';
import { jsx } from '@dashlane/ui-components';
import { Identity, IdentityTitle } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import Input from 'src/components/inputs/common/input/input';
import { parseDate } from 'src/app/vault/active-tab-list/lists/personal-info-list/identities/identity-list-item';
import SpaceName from 'src/components/inputs/common/space-name/space-name';
import { I18N_SHARED_KEY } from 'src/app/vault/utils/shared-translation';
import { FormContainer } from '../../common/form-container';
const I18N_KEYS = {
    TITLE_LABEL: 'tab/all_items/personalinfo/identity/view/label/title',
    LASTNAME_LABEL: 'tab/all_items/personalinfo/identity/view/label/lastname',
    LASTNAME2_LABEL: 'tab/all_items/personalinfo/identity/view/label/lastname2',
    MIDDLENAME_LABEL: 'tab/all_items/personalinfo/identity/view/label/middlename',
    FIRSTNAME_LABEL: 'tab/all_items/personalinfo/identity/view/label/firstname',
    USERNAME_LABEL: 'tab/all_items/personalinfo/identity/view/label/username',
    BIRTHDATE_LABEL: 'tab/all_items/personalinfo/identity/view/label/birthdate',
    BIRTHPLACE_LABEL: 'tab/all_items/personalinfo/identity/view/label/birthplace',
};
const I18N_TITLE_KEYS: Record<IdentityTitle, string> = {
    [IdentityTitle.Mr]: 'tab/all_items/personalinfo/identity/view/title/mr',
    [IdentityTitle.Mrs]: 'tab/all_items/personalinfo/identity/view/title/mme',
    [IdentityTitle.Miss]: 'tab/all_items/personalinfo/identity/view/title/mlle',
    [IdentityTitle.Ms]: 'tab/all_items/personalinfo/identity/view/title/ms',
    [IdentityTitle.Mx]: 'tab/all_items/personalinfo/identity/view/title/mx',
    [IdentityTitle.NoneOfThese]: 'tab/all_items/personalinfo/identity/view/title/none_of_these',
};
interface IdentityDetailFormProps {
    identity: Identity;
}
const IdentityDetailFormComponent = ({ identity }: IdentityDetailFormProps) => {
    const { translate, getLocaleMeta } = useTranslate();
    const { birthDate, birthPlace, firstName, lastName, lastName2, middleName, pseudo, spaceId, title, } = identity;
    return (<FormContainer>
      {title && (<Input id="title" inputType="text" label={translate(I18N_KEYS.TITLE_LABEL)} value={translate(I18N_TITLE_KEYS[title])} readonly/>)}
      {firstName && (<Input id="firstName" inputType="text" label={translate(I18N_KEYS.FIRSTNAME_LABEL)} value={firstName} readonly/>)}
      {middleName && (<Input id="middleName" inputType="text" label={translate(I18N_KEYS.MIDDLENAME_LABEL)} value={middleName} readonly/>)}
      {lastName && (<Input id="lastName" inputType="text" label={translate(I18N_KEYS.LASTNAME_LABEL)} value={lastName} readonly/>)}
      {lastName2 && (<Input id="lastName2" inputType="text" label={translate(I18N_KEYS.LASTNAME2_LABEL)} value={lastName2} readonly/>)}
      {pseudo && (<Input id="pseudo" inputType="text" label={translate(I18N_KEYS.USERNAME_LABEL)} value={pseudo} readonly/>)}
      {birthDate && (<Input id="birthDate" inputType="text" label={translate(I18N_KEYS.BIRTHDATE_LABEL)} value={Intl.DateTimeFormat(getLocaleMeta()?.code).format(parseDate(birthDate))} readonly/>)}
      {birthPlace && (<Input id="birthPlace" inputType="text" label={translate(I18N_KEYS.BIRTHPLACE_LABEL)} value={birthPlace} readonly/>)}
      {spaceId && (<SpaceName id="identityIdSpace" label={translate(I18N_SHARED_KEY.SPACE)} spaceId={spaceId}/>)}
    </FormContainer>);
};
export const IdentityDetailForm = memo(IdentityDetailFormComponent);
