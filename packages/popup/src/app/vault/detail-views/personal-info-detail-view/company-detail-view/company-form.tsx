import { memo } from "react";
import { jsx } from "@dashlane/ui-components";
import { DisplayField } from "@dashlane/design-system";
import { Company } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { I18N_SHARED_KEY } from "../../../utils/shared-translation";
import { FormContainer } from "../../common/form-container";
export const I18N_KEYS = {
  COMPANY_NAME_LABEL:
    "tab/all_items/personal_info/company/detail_view/label/company_name",
  JOB_TITLE: "tab/all_items/personal_info/company/detail_view/label/job_title",
};
interface Props {
  company: Company;
}
const CompanyFormComponent = ({ company }: Props) => {
  const { translate } = useTranslate();
  const { companyName, jobTitle, spaceId } = company;
  return (
    <FormContainer>
      {companyName && (
        <DisplayField
          id="companyName"
          label={translate(I18N_KEYS.COMPANY_NAME_LABEL)}
          value={companyName}
        />
      )}
      {jobTitle && (
        <DisplayField
          id="companyJobTitle"
          label={translate(I18N_KEYS.JOB_TITLE)}
          value={jobTitle}
        />
      )}
      {spaceId && (
        <SpaceName
          id="companyIdSpace"
          label={translate(I18N_SHARED_KEY.SPACE)}
          spaceId={spaceId}
        />
      )}
    </FormContainer>
  );
};
export const CompanyDetailForm = memo(CompanyFormComponent);
