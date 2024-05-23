import * as React from 'react';
import { Button, OpenWebsiteIcon, Tooltip, TrashIcon, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { goToWebsite } from './helpers';
const I18N_KEYS = {
    DELETE: 'webapp_credential_linked_websites_action_delete',
    GO_TO_WEBSITE: 'webapp_credential_linked_websites_action_goto',
};
interface Props {
    linkedWebsite: string;
    credentialId: string;
    onRemoveItem?: () => void;
}
export const LinkedWebsitesQuickActions = ({ linkedWebsite, credentialId, onRemoveItem, }: Props) => {
    const { translate } = useTranslate();
    return (<>
      {linkedWebsite.trim() ? (<Tooltip placement="top" content={translate(I18N_KEYS.GO_TO_WEBSITE)}>
          <Button nature="secondary" type="button" onClick={goToWebsite(linkedWebsite, credentialId)} style={{
                border: 'none',
                minWidth: 'fit-content',
                padding: '10px',
            }} role="link" name="hiddenAction" aria-label={translate(I18N_KEYS.GO_TO_WEBSITE)} data-testid={'open_linked_website'}>
            <OpenWebsiteIcon />
          </Button>
        </Tooltip>) : null}
      {onRemoveItem ? (<Tooltip placement="top" content={translate(I18N_KEYS.DELETE)}>
          <Button nature="secondary" type="button" onClick={onRemoveItem} style={{
                border: 'none',
                minWidth: 'fit-content',
                padding: '10px',
            }} name="hiddenAction" aria-label={translate(I18N_KEYS.DELETE)}>
            <TrashIcon />
          </Button>
        </Tooltip>) : null}
    </>);
};
