import React from 'react';
import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { openWebAppAndClosePopup } from 'src/app/helpers';
import { Header } from '../../common/header';
interface Props {
    credentialId: string;
    onClose: () => void;
}
const I18N_KEYS = {
    LINKED_WEBSITES_TITLE: 'tab/all_items/credential/linked_websites_view/title',
};
const LinkedWebsitesHeaderComponent = ({ credentialId, onClose }: Props) => {
    const { translate } = useTranslate();
    const openLinkedWebsitesInWebApp = () => {
        const webappQuery = {
            tab: 'linked-websites',
        };
        void openWebAppAndClosePopup({
            id: credentialId,
            query: webappQuery,
            route: '/passwords',
        });
    };
    return (<Header title={translate(I18N_KEYS.LINKED_WEBSITES_TITLE)} onEdit={openLinkedWebsitesInWebApp} onClose={onClose}/>);
};
export const LinkedWebsitesHeader = React.memo(LinkedWebsitesHeaderComponent);
