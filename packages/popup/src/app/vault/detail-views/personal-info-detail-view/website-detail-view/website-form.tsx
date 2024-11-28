import React, { memo } from "react";
import { Website } from "@dashlane/vault-contracts";
import { DisplayField } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { I18N_SHARED_KEY } from "../../../utils/shared-translation";
import { FormContainer } from "../../common/form-container";
export const I18N_KEYS = {
  WEBSITE_URL_LABEL:
    "tab/all_items/personal_info/website/detail_view/label/website_url",
  WEBSITE_NAME_LABEL:
    "tab/all_items/personal_info/website/detail_view/label/website_name",
};
interface Props {
  website: Website;
}
const WebsiteFormComponent = ({ website }: Props) => {
  const { translate } = useTranslate();
  const { itemName, spaceId, URL } = website;
  return (
    <FormContainer>
      {URL && (
        <DisplayField
          id="websiteURL"
          label={translate(I18N_KEYS.WEBSITE_URL_LABEL)}
          value={URL}
        />
      )}
      {itemName && (
        <DisplayField
          id="websiteName"
          label={translate(I18N_KEYS.WEBSITE_NAME_LABEL)}
          value={itemName}
        />
      )}
      {spaceId && (
        <SpaceName
          id="websiteIdSpace"
          label={translate(I18N_SHARED_KEY.SPACE)}
          spaceId={spaceId}
        />
      )}
    </FormContainer>
  );
};
export const WebsiteDetailForm = memo(WebsiteFormComponent);
