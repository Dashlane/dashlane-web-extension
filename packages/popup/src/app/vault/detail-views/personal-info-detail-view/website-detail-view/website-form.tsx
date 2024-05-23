import React, { memo } from 'react';
import { Website } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import Input from 'src/components/inputs/common/input/input';
import SpaceName from 'src/components/inputs/common/space-name/space-name';
import { I18N_SHARED_KEY } from 'src/app/vault/utils/shared-translation';
import { FormContainer } from '../../common/form-container';
export const I18N_KEYS = {
    WEBSITE_URL_LABEL: 'tab/all_items/personal_info/website/detail_view/label/website_url',
    WEBSITE_NAME_LABEL: 'tab/all_items/personal_info/website/detail_view/label/website_name',
};
interface Props {
    website: Website;
}
const WebsiteFormComponent = ({ website }: Props) => {
    const { translate } = useTranslate();
    const { itemName, spaceId, URL } = website;
    return (<FormContainer>
      {URL && (<Input id="websiteURL" inputType="text" label={translate(I18N_KEYS.WEBSITE_URL_LABEL)} value={URL} readonly/>)}
      {itemName && (<Input id="websiteName" inputType="text" label={translate(I18N_KEYS.WEBSITE_NAME_LABEL)} value={itemName} readonly/>)}
      {spaceId && (<SpaceName id="websiteIdSpace" label={translate(I18N_SHARED_KEY.SPACE)} spaceId={spaceId}/>)}
    </FormContainer>);
};
export const WebsiteDetailForm = memo(WebsiteFormComponent);
