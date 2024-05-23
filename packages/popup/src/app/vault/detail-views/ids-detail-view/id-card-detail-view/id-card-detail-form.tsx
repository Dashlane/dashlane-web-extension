import { memo } from 'react';
import { jsx, useToast } from '@dashlane/design-system';
import { Field } from '@dashlane/hermes';
import { IdCard, VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import SpaceName from 'src/components/inputs/common/space-name/space-name';
import Input from 'src/components/inputs/common/input/input';
import { CopyIconButton } from '../../credential-detail-view/form-fields/copy-icon-button';
import { useCopyAction } from '../../credential-detail-view/useCopyAction';
import { FormContainer } from '../../common/form-container';
import { dateFormatter } from '../../helpers';
export const I18N_KEYS = {
    NAME_LABEL: 'tab/all_items/ids/id_card/detail_view/label/name',
    NUMBER_LABEL: 'tab/all_items/ids/id_card/detail_view/label/number',
    ISSUE_DATE_LABEL: 'tab/all_items/ids/id_card/detail_view/label/issue_date',
    EXPIRATION_DATE_LABEL: 'tab/all_items/ids/id_card/detail_view/label/expiration_date',
    COUNTRY_LABEL: 'tab/all_items/ids/id_card/detail_view/label/country',
    SPACE_LABEL: 'tab/all_items/ids/id_card/detail_view/label/space',
};
export const I18N_ACTION_KEYS = {
    NUMBER_COPY: 'tab/all_items/ids/id_card/detail_view/actions/copy_number',
    NUMBER_COPIED: 'tab/all_items/ids/id_card/detail_view/actions/number_copied_to_clipboard',
};
interface Props {
    idCard: IdCard;
}
const IdCardFormComponent = ({ idCard }: Props) => {
    const { issueDate, idName, spaceId, country, expirationDate, id, idNumber } = idCard;
    const { getLocaleMeta, translate } = useTranslate();
    const { showToast } = useToast();
    const idCardNumberCopyAction = useCopyAction({
        toastString: translate(I18N_ACTION_KEYS.NUMBER_COPIED),
        showToast,
        itemType: VaultItemType.IdCard,
        field: Field.Number,
        itemId: id,
        isProtected: false,
        value: idNumber,
    });
    return (<FormContainer>
      {idName ? (<Input id="idCardName" inputType="text" label={translate(I18N_KEYS.NAME_LABEL)} value={idName} readonly/>) : null}
      {idNumber ? (<Input id="idCardNumber" inputType="text" label={translate(I18N_KEYS.NUMBER_LABEL)} value={idNumber} readonly actions={<CopyIconButton text={translate(I18N_ACTION_KEYS.NUMBER_COPY)} copyAction={() => {
                    void idCardNumberCopyAction();
                }}/>}/>) : null}
      {issueDate ? (<Input id="idCardIssueDate" inputType="text" label={translate(I18N_KEYS.ISSUE_DATE_LABEL)} value={dateFormatter(issueDate, getLocaleMeta()?.code)} readonly/>) : null}
      {expirationDate ? (<Input id="idCardExpirationDate" inputType="text" label={translate(I18N_KEYS.EXPIRATION_DATE_LABEL)} value={dateFormatter(expirationDate, getLocaleMeta()?.code)} readonly/>) : null}
      {country ? (<Input id="idCardCountry" inputType="text" label={translate(I18N_KEYS.COUNTRY_LABEL)} value={country} readonly/>) : null}
      {spaceId ? (<SpaceName id="idCardSpace" label={translate(I18N_KEYS.SPACE_LABEL)} spaceId={spaceId}/>) : null}
    </FormContainer>);
};
export const IdCardDetailForm = memo(IdCardFormComponent);
