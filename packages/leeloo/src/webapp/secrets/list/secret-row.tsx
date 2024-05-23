import * as React from 'react';
import { fromUnixTime } from 'date-fns';
import LocalizedTimeAgo from 'libs/i18n/localizedTimeAgo';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import Row from 'webapp/list-view/row';
import useTranslate from 'libs/i18n/useTranslate';
import { TranslatorInterface } from 'libs/i18n/types';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { LockedItemType, UnlockerAction } from 'webapp/unlock-items/types';
import styles from '../styles.css';
import { SecretTitle } from './secret-title';
import { Secret } from '@dashlane/vault-contracts';
const displayCreatedAt = (translate: TranslatorInterface, { creationDatetime }: Secret): React.ReactNode => {
    return creationDatetime ? (<IntelligentTooltipOnOverflow>
      {translate.shortDate(fromUnixTime(creationDatetime))}
    </IntelligentTooltipOnOverflow>) : null;
};
const displayUpdatedAt = ({ userModificationDatetime, }: Secret): React.ReactNode => {
    return userModificationDatetime ? (<IntelligentTooltipOnOverflow>
      <LocalizedTimeAgo date={fromUnixTime(userModificationDatetime)}/>
    </IntelligentTooltipOnOverflow>) : null;
};
interface Props {
    secret: Secret;
}
export const SecretRow = ({ secret }: Props) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const isSecretLocked = !areProtectedItemsUnlocked;
    const { translate } = useTranslate();
    const onRowClick = (e: React.MouseEvent<HTMLElement>) => {
        if (isSecretLocked) {
            e.preventDefault();
            e.stopPropagation();
            openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.Secret,
                successCallback: () => {
                    redirect(routes.userSecret(secret.id));
                },
            });
        }
        else {
            redirect(routes.userSecret(secret.id));
        }
    };
    const rowData = [
        {
            key: 'title',
            content: <SecretTitle secret={secret}/>,
        },
        {
            key: 'createdAt',
            content: displayCreatedAt(translate, secret),
            className: styles.created,
        },
        {
            key: 'updatedAt',
            content: displayUpdatedAt(secret),
            className: styles.updated,
        },
    ];
    return <Row key={secret.id} onClick={onRowClick} data={rowData}/>;
};
