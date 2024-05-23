import { memo } from 'react';
import { jsx } from '@dashlane/ui-components';
import { Company } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import Input from 'src/components/inputs/common/input/input';
import SpaceName from 'src/components/inputs/common/space-name/space-name';
import { I18N_SHARED_KEY } from 'src/app/vault/utils/shared-translation';
import { FormContainer } from '../../common/form-container';
export const I18N_KEYS = {
    COMPANY_NAME_LABEL: 'tab/all_items/personal_info/company/detail_view/label/company_name',
    JOB_TITLE: 'tab/all_items/personal_info/company/detail_view/label/job_title',
};
interface Props {
    company: Company;
}
const CompanyFormComponent = ({ company }: Props) => {
    const { translate } = useTranslate();
    const { companyName, jobTitle, spaceId } = company;
    return (<FormContainer>
      {companyName && (<Input id="companyName" inputType="text" label={translate(I18N_KEYS.COMPANY_NAME_LABEL)} value={companyName} readonly/>)}
      {jobTitle && (<Input id="companyJobTitle" inputType="text" label={translate(I18N_KEYS.JOB_TITLE)} value={jobTitle} readonly/>)}
      {spaceId && (<SpaceName id="companyIdSpace" label={translate(I18N_SHARED_KEY.SPACE)} spaceId={spaceId}/>)}
    </FormContainer>);
};
export const CompanyDetailForm = memo(CompanyFormComponent);
