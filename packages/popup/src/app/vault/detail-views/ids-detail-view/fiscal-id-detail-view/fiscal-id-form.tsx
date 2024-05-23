import { memo } from 'react';
import { jsx, useToast } from '@dashlane/design-system';
import { Field } from '@dashlane/hermes';
import { FiscalId, VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { I18N_SHARED_KEY } from 'src/app/vault/utils/shared-translation';
import Input from 'src/components/inputs/common/input/input';
import SpaceName from 'src/components/inputs/common/space-name/space-name';
import { CopyIconButton } from '../../credential-detail-view/form-fields/copy-icon-button';
import { useCopyAction } from '../../credential-detail-view/useCopyAction';
import { FormContainer } from '../../common/form-container';
export const I18N_KEYS = {
    FISCAL_ID_NUMBER_LABEL: 'tab/all_items/ids/fiscal_id/detail_view/label/number',
    FISCAL_ID_COUNTRY_LABEL: 'tab/all_items/ids/fiscal_id/detail_view/label/country',
    FISCAL_ID_SPACE_LABEL: 'tab/all_items/ids/fiscal_id/detail_view/label/space',
    FISCAL_ID_NUMBER_COPY: 'tab/all_items/ids/fiscal_id/detail_view/actions/copy_number',
    FISCAL_ID_NUMBER_COPIED: 'tab/all_items/ids/fiscal_id/detail_view/actions/copied_clipboard',
};
interface Props {
    fiscalId: FiscalId;
}
const FiscalIdFormComponent = ({ fiscalId }: Props) => {
    const { translate } = useTranslate();
    const { showToast } = useToast();
    const { id, country, spaceId, fiscalNumber } = fiscalId;
    const fiscalIdNumberCopyAction = useCopyAction({
        toastString: translate(I18N_KEYS.FISCAL_ID_NUMBER_COPIED),
        showToast,
        itemType: VaultItemType.FiscalId,
        field: Field.FiscalNumber,
        itemId: id,
        isProtected: false,
        value: fiscalNumber,
    });
    return (<FormContainer>
      {fiscalNumber ? (<Input id="fiscalIdNumber" inputType="text" label={translate(I18N_KEYS.FISCAL_ID_NUMBER_LABEL)} value={fiscalNumber} readonly actions={<CopyIconButton text={translate(I18N_KEYS.FISCAL_ID_NUMBER_COPY)} copyAction={() => {
                    void fiscalIdNumberCopyAction();
                }}/>}/>) : null}
      {country ? (<Input id="fiscalIdCountry" inputType="text" label={translate(I18N_KEYS.FISCAL_ID_COUNTRY_LABEL)} value={country} readonly/>) : null}
      {spaceId ? (<SpaceName id="fiscalIdSpace" label={translate(I18N_SHARED_KEY.SPACE)} spaceId={spaceId}/>) : null}
    </FormContainer>);
};
export const FiscalIdDetailForm = memo(FiscalIdFormComponent);
