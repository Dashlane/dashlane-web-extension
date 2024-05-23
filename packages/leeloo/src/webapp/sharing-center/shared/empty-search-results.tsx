import * as React from 'react';
import { EmptyFolderIcon, Paragraph } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { EmptyView } from 'webapp/empty-view/empty-view';
const I18N_KEYS = {
    NO_RESULTS_TITLE: 'webapp_sharing_center_panel_empty_search_title',
    NO_RESULTS_DESCRIPTION: 'webapp_sharing_center_panel_empty_search_description',
};
export const EmptySearchResults = () => {
    const { translate } = useTranslate();
    return (<EmptyView icon={<EmptyFolderIcon size={92} color="ds.text.neutral.quiet"/>} title={translate(I18N_KEYS.NO_RESULTS_TITLE)}>
      <Paragraph>{translate(I18N_KEYS.NO_RESULTS_DESCRIPTION)}</Paragraph>
    </EmptyView>);
};
