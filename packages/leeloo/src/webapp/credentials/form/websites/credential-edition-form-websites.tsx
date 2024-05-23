import * as React from 'react';
import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { LinkedWebsitesCount } from '../../linked-websites/linked-websites-count';
import { AddLinkedWebsiteButton } from '../../linked-websites/add-linked-website-button';
import { WebsitesComponent } from './websites-component';
const I18N_KEYS = {
    ADD_LINKED_WEBSITE: 'webapp_credential_edition_linked_websites_add_website',
    MANAGE_LINKED_WEBSITE: 'webapp_credential_edition_linked_websites_manage',
};
interface Props {
    url: string;
    isWebsiteFieldReadonly: boolean;
    linkedWebsitesAddedByUser: string[];
    dashlaneDefinedLinkedWebsites?: string[];
    hasUrlError: boolean;
    editViewButtonEnabled: boolean;
    handleChange: (eventOrValue: React.ChangeEvent<any> | any, key?: string) => void;
    handleGoToWebsite: () => void;
    limitedPermissions?: boolean;
    onClickAddNewWebsite?: () => void;
}
export const CredentialEditionWebsitesComponent = ({ url, linkedWebsitesAddedByUser, dashlaneDefinedLinkedWebsites, hasUrlError, editViewButtonEnabled, limitedPermissions = false, handleChange, handleGoToWebsite, onClickAddNewWebsite, isWebsiteFieldReadonly, }: Props) => {
    const { translate } = useTranslate();
    const userLinkedWebsitesLength = linkedWebsitesAddedByUser.length;
    const dashlaneLinkedWebsitesLength = dashlaneDefinedLinkedWebsites && dashlaneDefinedLinkedWebsites.length > 1
        ? dashlaneDefinedLinkedWebsites.length
        : 0;
    const totalLinkedWebsitesLength = userLinkedWebsitesLength + dashlaneLinkedWebsitesLength;
    return (<WebsitesComponent url={url} hasUrlError={hasUrlError} editViewButtonEnabled={editViewButtonEnabled} handleMainWebsiteChange={handleChange} handleGoToWebsite={handleGoToWebsite} isWebsiteFieldReadonly={isWebsiteFieldReadonly}>
      <div sx={{
            display: 'flex',
            justifyContent: totalLinkedWebsitesLength > 0 ? 'space-between' : 'flex-end',
        }}>
        <LinkedWebsitesCount totalLinkedWebsitesLength={totalLinkedWebsitesLength}/>
        {onClickAddNewWebsite && !limitedPermissions ? (<AddLinkedWebsiteButton handleOnClickAddLinkedWebsiteButton={onClickAddNewWebsite} disabled={isWebsiteFieldReadonly} label={totalLinkedWebsitesLength > 0
                ? translate(I18N_KEYS.MANAGE_LINKED_WEBSITE)
                : translate(I18N_KEYS.ADD_LINKED_WEBSITE)}/>) : null}
      </div>
    </WebsitesComponent>);
};
