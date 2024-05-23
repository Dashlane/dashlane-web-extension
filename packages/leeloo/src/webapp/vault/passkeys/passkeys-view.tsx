import { Fragment, useEffect } from 'react';
import { fromUnixTime } from 'date-fns';
import { Lee } from 'lee';
import { Passkey, SortDirection, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { jsx } from '@dashlane/design-system';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { Highlight, ItemType, PageView, UserSelectVaultItemEvent, } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { CredentialInfo } from 'libs/dashlane-style/credential-info/credential-info';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow';
import LocalizedTimeAgo from 'libs/i18n/localizedTimeAgo';
import { useLocation, useRouterGlobalSettingsContext } from 'libs/router';
import { getCurrentSpaceId } from 'libs/webapp';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { Header as ListHeader } from 'webapp/list-view/header';
import Row from 'webapp/list-view/row';
import { SX_STYLES } from 'webapp/credentials/style';
import { PasskeysEmptyView } from './passkeys-empty-view';
import { PasskeysHeader } from './passkeys-header';
const I18N_KEYS = {
    ROW_NAME: 'webapp_credentials_header_row_name',
    ROW_LAST_USED: 'webapp_credentials_header_row_last_used',
    LAST_USED_NEVER: 'webapp_credentials_row_last_used_never',
};
interface Props {
    lee: Lee;
}
export const PasskeysView = ({ lee }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const { pathname } = useLocation();
    const currentSpaceId = getCurrentSpaceId(lee.globalState);
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Passkey],
        propertyFilters: currentSpaceId !== null
            ? [
                {
                    property: 'spaceId',
                    value: currentSpaceId,
                },
            ]
            : undefined,
        propertySorting: {
            property: 'creationDatetime',
            direction: SortDirection.Descend,
        },
    });
    useEffect(() => {
        logPageView(PageView.ItemPasskeyList);
    }, []);
    const onRowClick = (passkey: Passkey) => {
        logEvent(new UserSelectVaultItemEvent({
            itemId: passkey.id,
            itemType: ItemType.Passkey,
            highlight: Highlight.None,
        }));
    };
    return (<>
      <PasskeysHeader />
      {status === DataStatus.Success ? (<>
          {!data.passkeysResult.matchCount ? (<PasskeysEmptyView />) : (<div style={{
                    position: 'relative',
                    height: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
              <ListHeader header={[
                    {
                        key: 'title',
                        sortable: true,
                        content: translate(I18N_KEYS.ROW_NAME),
                        logSubaction: 'name',
                    },
                    {
                        key: 'lastUse',
                        sortable: true,
                        content: translate(I18N_KEYS.ROW_LAST_USED),
                        sxProps: SX_STYLES.LAST_USE_CELL,
                        logSubaction: 'lastUsed',
                    },
                ]}/>
              <div sx={{
                    height: '100%',
                    overflow: 'auto',
                }}>
                <ul>
                  {data.passkeysResult.items.map((passkey: Passkey) => (<Row key={passkey.id} link={routes.userVaultItem(passkey.id, VaultItemType.Passkey, pathname)} style={{ height: '60px' }} type={'link'} onClick={() => onRowClick(passkey)} data={[
                        {
                            key: 'title',
                            content: (<CredentialInfo title={passkey.itemName ?? passkey.rpName} login={passkey.userDisplayName} sxProps={{
                                    maxWidth: '350px',
                                    minWidth: 0,
                                    marginRight: '8px',
                                }}/>),
                        },
                        {
                            key: 'lastUse',
                            content: (<IntelligentTooltipOnOverflow>
                              {passkey.lastUse ? (<LocalizedTimeAgo date={fromUnixTime(passkey.lastUse)}/>) : (translate(I18N_KEYS.LAST_USED_NEVER))}
                            </IntelligentTooltipOnOverflow>),
                            sxProps: SX_STYLES.LAST_USE_CELL,
                        },
                    ]}/>))}
                </ul>
              </div>
            </div>)}
        </>) : null}
    </>);
};
