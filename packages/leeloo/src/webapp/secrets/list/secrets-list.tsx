import { OrderDir } from '@dashlane/communication';
import { Button, Icon } from '@dashlane/design-system';
import { AddIcon, FlexContainer, jsx } from '@dashlane/ui-components';
import { EmptyView } from 'webapp/empty-view/empty-view';
import { PaywallManager, PaywallName } from 'webapp/paywall';
import { SecretRow } from './secret-row';
import useTranslate from 'libs/i18n/useTranslate';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { Secret, SortDirection, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { SX_STYLES } from './styles';
import { SortingOptions } from 'webapp/list-view/types';
export interface Props {
    className?: string;
    header: JSX.Element;
    sortCriteria: SortingOptions[];
}
const I18N_KEYS = {
    TITLE: 'webapp_secrets_empty_view_title',
    DESCRIPTION: 'webapp_secrets_empty_view_description',
    ADD_NOTE_BUTTON: 'webapp_secure_notes_header_add',
};
export const SecretsList = ({ className, header, sortCriteria }: Props) => {
    const history = useHistory();
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const { currentSpaceId } = useTeamSpaceContext();
    const { data: secretsData, status } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Secret],
        propertyFilters: currentSpaceId !== null
            ? [
                {
                    property: 'spaceId',
                    value: currentSpaceId,
                },
            ]
            : undefined,
        propertySorting: {
            property: sortCriteria[0].field,
            direction: sortCriteria[0]?.direction === OrderDir.ascending
                ? SortDirection.Ascend
                : SortDirection.Descend,
        },
    });
    if (status !== DataStatus.Success) {
        return null;
    }
    const { secretsResult: { items: secrets }, } = secretsData;
    const onClickAddNew = () => {
        history.push(routes.userAddBlankSecret);
    };
    if (secrets && secrets.length > 0) {
        return (<div sx={{
                fontSize: '15px',
                color: 'hsl(0, 0%, 11%)',
                whiteSpace: 'nowrap',
                position: 'relative',
            }}>
        {header}
        <div className={className} sx={SX_STYLES.LIST}>
          <ul sx={{
                height: '100%',
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                overflow: 'auto',
            }}>
            {secrets.map((secret: Secret) => (<SecretRow key={`secrets_list_secretId_${secret.id}`} secret={secret}/>))}
          </ul>
        </div>
      </div>);
    }
    else {
        return (<PaywallManager mode="fullscreen" paywall={PaywallName.SecureNote}>
        <EmptyView icon={<Icon name="RecoveryKeyOutlined" size={'xlarge'} color="ds.text.neutral.quiet"/>} title={translate(I18N_KEYS.TITLE)}>
          <p>{translate(I18N_KEYS.DESCRIPTION)}</p>
          <br />
          <FlexContainer gap={4} justifyContent="center">
            <Button layout="iconLeading" icon={<AddIcon color="ds.text.inverse.catchy"/>} onClick={onClickAddNew}>
              {translate(I18N_KEYS.ADD_NOTE_BUTTON)}
            </Button>
          </FlexContainer>
        </EmptyView>
      </PaywallManager>);
    }
};
