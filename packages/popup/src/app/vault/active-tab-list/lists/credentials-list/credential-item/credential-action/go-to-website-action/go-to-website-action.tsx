import React from 'react';
import { OpenWebsiteIcon } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { openCredentialWebsite } from 'src/app/vault/detail-views/helpers';
import { IconButtonWithTooltip } from 'src/components/icon-button-with-tooltip/icon-button-with-tooltip';
interface Props {
    id: string;
    URL: string;
}
const I18N_KEYS = {
    GO_TO_WEBSITE: 'tab/all_items/credential/actions/go_to_website',
    NO_WEBSITE: 'tab/all_items/credential/actions/no_website',
};
const GoToWebsiteActionComponent: React.FC<Props> = ({ id, URL }) => {
    const { translate } = useTranslate();
    const onClick: React.MouseEventHandler = (event) => {
        event.stopPropagation();
        openCredentialWebsite(id, URL);
    };
    const disabled = !URL;
    return (<IconButtonWithTooltip key="actions/go_to_website" data-testid="actions/go_to_website" tooltipContent={disabled
            ? translate(I18N_KEYS.NO_WEBSITE)
            : translate(I18N_KEYS.GO_TO_WEBSITE)} disabled={disabled} onClick={onClick} icon={<OpenWebsiteIcon />} role="link"/>);
};
export const GoToWebsiteAction = React.memo(GoToWebsiteActionComponent);
