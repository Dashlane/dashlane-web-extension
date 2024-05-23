import React from 'react';
import { Secret } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { Item, ItemNotFound } from 'webapp/sharing-invite/item';
import { Icon } from '@dashlane/design-system';
const I18N_KEYS = {
    NO_SECRETS: 'webapp_sharing_invite_no_secrets_found',
    NO_SELECTED: 'webapp_sharing_invite_no_selected_secrets_found',
};
export interface Props {
    freeLimitReached: boolean;
    onCheckSecret: (id: string, checked: boolean) => void;
    selectedSecrets: string[];
    elementsOnlyShowSelected: boolean;
    secrets: Secret[];
}
export const SecretsList = ({ freeLimitReached, onCheckSecret, selectedSecrets, elementsOnlyShowSelected, secrets, }: Props) => {
    const { translate } = useTranslate();
    if (!secrets?.length) {
        const copy = elementsOnlyShowSelected
            ? translate(I18N_KEYS.NO_SELECTED)
            : translate(I18N_KEYS.NO_SECRETS);
        return <ItemNotFound text={copy}/>;
    }
    return (<ul>
      {secrets.map((secret: Secret, index: number) => {
            if (!secret ||
                (elementsOnlyShowSelected && !selectedSecrets.includes(secret.id))) {
                return null;
            }
            const logo = (<Icon name="RecoveryKeyOutlined" color="ds.text.neutral.standard"/>);
            const onCheck = (isChecked: boolean) => onCheckSecret(secret.id, isChecked);
            const checked = selectedSecrets.includes(secret.id);
            return (<Item key={index} {...{
                logo,
                onCheck,
                checked,
                item: secret,
                freeLimitReached,
                title: secret.title,
            }}/>);
        })}
    </ul>);
};
