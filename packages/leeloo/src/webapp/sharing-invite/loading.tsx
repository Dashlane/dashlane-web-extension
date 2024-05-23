import * as React from 'react';
import { DialogBody, GridContainer, Paragraph } from '@dashlane/ui-components';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = { LOADING: 'webapp_sharing_invite_loading' };
export const ShareLoading = () => {
    const { translate } = useTranslate();
    return (<DialogBody>
      <GridContainer justifyContent="center" alignItems="center" gap="16px" data-testid="loading-share-dialog">
        <LoadingSpinner size={100}/>
        <Paragraph color="ds.text.neutral.quiet">
          {translate(I18N_KEYS.LOADING)}
        </Paragraph>
      </GridContainer>
    </DialogBody>);
};
