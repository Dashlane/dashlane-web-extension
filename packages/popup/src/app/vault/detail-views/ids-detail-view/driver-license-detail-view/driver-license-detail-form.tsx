import { memo } from 'react';
import { Field } from '@dashlane/hermes';
import { DriversLicense, VaultItemType } from '@dashlane/vault-contracts';
import { jsx, useToast } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import Input from 'src/components/inputs/common/input/input';
import SpaceName from 'src/components/inputs/common/space-name/space-name';
import { FormContainer } from '../../common/form-container';
import { useCopyAction } from '../../credential-detail-view/useCopyAction';
import { CopyIconButton } from '../../credential-detail-view/form-fields/copy-icon-button';
import { dateFormatter } from '../../helpers';
export const I18N_KEYS = {
    NAME_LABEL: 'tab/all_items/ids/driver_license/detail_view/label/name',
    NUMBER_LABEL: 'tab/all_items/ids/driver_license/detail_view/label/number',
    ISSUE_DATE_LABEL: 'tab/all_items/ids/driver_license/detail_view/label/issue_date',
    EXPIRATION_DATE_LABEL: 'tab/all_items/ids/driver_license/detail_view/label/expiration_date',
    COUNTRY_LABEL: 'tab/all_items/ids/driver_license/detail_view/label/country',
    SPACE_LABEL: 'tab/all_items/ids/driver_license/detail_view/label/space',
};
export const I18N_ACTION_KEYS = {
    NUMBER_COPY: 'tab/all_items/ids/driver_license/detail_view/actions/copy_number',
    NUMBER_COPIED: 'tab/all_items/ids/driver_license/detail_view/actions/number_copied_to_clipboard',
};
interface DriverLicenseDetailFormProps {
    driversLicense: DriversLicense;
}
const DriverLicenseDetailFormComponent = ({ driversLicense, }: DriverLicenseDetailFormProps) => {
    const { getLocaleMeta, translate } = useTranslate();
    const { showToast } = useToast();
    const { country, expirationDate, id, spaceId, idNumber, issueDate, idName } = driversLicense;
    const numberCopyAction = useCopyAction({
        showToast,
        itemType: VaultItemType.DriversLicense,
        itemId: id,
        isProtected: false,
        toastString: translate(I18N_ACTION_KEYS.NUMBER_COPIED),
        field: Field.Number,
        value: idNumber,
    });
    return (<FormContainer>
      {idName && (<Input id="idName" inputType="text" label={translate(I18N_KEYS.NAME_LABEL)} value={idName} readonly/>)}
      {idNumber && (<Input id="idNumber" inputType="text" label={translate(I18N_KEYS.NUMBER_LABEL)} value={idNumber} readonly actions={<CopyIconButton text={translate(I18N_ACTION_KEYS.NUMBER_COPY)} copyAction={() => {
                    void numberCopyAction();
                }}/>}/>)}
      {issueDate && (<Input id="issueDate" inputType="text" label={translate(I18N_KEYS.ISSUE_DATE_LABEL)} value={dateFormatter(issueDate, getLocaleMeta()?.code)} readonly/>)}
      {expirationDate && (<Input id="expirationDate" inputType="text" label={translate(I18N_KEYS.EXPIRATION_DATE_LABEL)} value={dateFormatter(expirationDate, getLocaleMeta()?.code)} readonly/>)}
      {country !== 'UNIVERSAL' && (<Input id="country" inputType="text" label={translate(I18N_KEYS.COUNTRY_LABEL)} value={country} readonly/>)}
      {spaceId && (<SpaceName id="space" label={translate(I18N_KEYS.SPACE_LABEL)} spaceId={spaceId}/>)}
    </FormContainer>);
};
export const DriverLicenseDetailForm = memo(DriverLicenseDetailFormComponent);
