import React, { useEffect, useState } from 'react';
import { Link, useRouterGlobalSettingsContext } from 'libs/router';
import { Button } from '@dashlane/design-system';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    PASSWORD_HISTORY_BUTTON: 'webapp_password_history_detailed_password_view_button',
};
interface Props {
    credentialId: string;
}
export const PasswordHistoryButton = ({ credentialId }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const routeLink = routes.userPasswordHistoryFilteredByCredential(credentialId);
    const [credHasPasswordHistory, setCredHasPasswordHistory] = useState(false);
    useEffect(() => {
        carbonConnector
            .getHasPasswordHistory(credentialId)
            .then((hasPasswordHistory) => {
            if (hasPasswordHistory) {
                setCredHasPasswordHistory(true);
            }
        });
    }, [credentialId]);
    return credHasPasswordHistory ? (<div>
      <Link to={routeLink} tabIndex={-1}>
        <Button mood="neutral" intensity="supershy" title={translate(I18N_KEYS.PASSWORD_HISTORY_BUTTON)} icon="HistoryBackupOutlined" layout="iconLeading">
          {translate(I18N_KEYS.PASSWORD_HISTORY_BUTTON)}
        </Button>
      </Link>
    </div>) : null;
};
