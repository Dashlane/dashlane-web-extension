import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { jsx, Paragraph } from '@dashlane/design-system';
const I18N_KEYS = {
    LINKED_WEBSITES_COUNT: 'webapp_credential_edition_linked_websites_title_with_count',
};
interface LinkedWebsitesCountProps {
    totalLinkedWebsitesLength: number;
}
export const LinkedWebsitesCount = ({ totalLinkedWebsitesLength, }: LinkedWebsitesCountProps) => {
    const { translate } = useTranslate();
    return totalLinkedWebsitesLength > 0 ? (<Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.quiet" sx={{ marginTop: '12px', marginLeft: '12px' }}>
      {translate(I18N_KEYS.LINKED_WEBSITES_COUNT, {
            count: totalLinkedWebsitesLength,
        })}
    </Paragraph>) : null;
};
