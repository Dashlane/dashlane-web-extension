import { memo } from 'react';
import { jsx, useToast } from '@dashlane/design-system';
import { Field } from '@dashlane/hermes';
import { SocialSecurityId, VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import Input from 'src/components/inputs/common/input/input';
import SpaceName from 'src/components/inputs/common/space-name/space-name';
import { FormContainer } from '../../common/form-container';
import { CopyIconButton } from '../../credential-detail-view/form-fields/copy-icon-button';
import { useCopyAction } from '../../credential-detail-view/useCopyAction';
const I18N_KEYS = {
    NAME_LABEL: 'tab/all_items/ids/social_security/detail_view/label/name',
    NUMBER_LABEL: 'tab/all_items/ids/social_security/detail_view/label/number',
    COUNTRY_LABEL: 'tab/all_items/ids/social_security/detail_view/label/country',
    SPACE_LABEL: 'tab/all_items/ids/social_security/detail_view/label/space',
};
const I18N_ACTION_KEYS = {
    NUMBER_COPY: 'tab/all_items/ids/social_security/detail_view/actions/copy_number',
    NUMBER_COPIED: 'tab/all_items/ids/social_security/detail_view/actions/number_copied_to_clipboard',
};
interface Props {
    socialSecurityId: SocialSecurityId;
}
const SocialSecurityIdFormComponent = ({ socialSecurityId }: Props) => {
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const { country, id, idNumber, idName, spaceId } = socialSecurityId;
    const socialSecurityNumberCopyAction = useCopyAction({
        toastString: translate(I18N_ACTION_KEYS.NUMBER_COPIED),
        showToast,
        itemType: VaultItemType.SocialSecurityId,
        field: Field.SocialSecurityNumber,
        itemId: id,
        isProtected: false,
        value: idNumber,
    });
    return (<FormContainer>
      {idName && (<Input id="socialSecurityIdName" inputType="text" label={translate(I18N_KEYS.NAME_LABEL)} value={idName} readonly/>)}
      {idNumber && (<Input id="socialSecurityIdNumber" inputType="text" label={translate(I18N_KEYS.NUMBER_LABEL)} value={idNumber} readonly actions={<CopyIconButton text={translate(I18N_ACTION_KEYS.NUMBER_COPY)} copyAction={() => {
                    void socialSecurityNumberCopyAction();
                }}/>}/>)}
      {country && (<Input id="socialSecurityIdCountry" inputType="text" label={translate(I18N_KEYS.COUNTRY_LABEL)} value={country} readonly/>)}
      {spaceId && (<SpaceName id="socialSecurityIdSpace" label={translate(I18N_KEYS.SPACE_LABEL)} spaceId={spaceId}/>)}
    </FormContainer>);
};
export const SocialSecurityIdDetailForm = memo(SocialSecurityIdFormComponent);
