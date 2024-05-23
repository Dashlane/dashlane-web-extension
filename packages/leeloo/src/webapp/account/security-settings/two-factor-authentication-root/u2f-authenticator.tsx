import * as React from 'react';
import { colors, DotsIcon, DropdownElement, DropdownMenu, FlexContainer, IconButton, jsx, Paragraph, TrashIcon, U2fDeviceIcon, } from '@dashlane/ui-components';
import { fromUnixTime } from 'date-fns';
import useTranslate from 'libs/i18n/useTranslate';
import { useIsRemoveU2FAuthenticatorAvailable } from 'webapp/two-factor-authentication/u2f-authenticators/hooks/use-is-remove-u2f-authenticator-available';
const I18N_KEYS = {
    ADDED_DATE: 'webapp_account_security_settings_2fa_u2f_added_date',
    MENU_TITLE: 'webapp_account_security_settings_2fa_u2f_menu_title',
    MENU_DELETE: 'webapp_account_security_settings_2fa_u2f_menu_delete',
};
interface Props {
    name: string;
    creationDateUnix: number;
    keyHandle: string;
    onRemoveAuthenticator: (keyHandle: string) => void;
}
export const U2FAuthenticator = ({ name, creationDateUnix, keyHandle, onRemoveAuthenticator, }: Props) => {
    const isRemoveU2FAuthenticatorAvailable = useIsRemoveU2FAuthenticatorAvailable();
    const { translate } = useTranslate();
    const timestamp = fromUnixTime(creationDateUnix);
    const handleOnRemoveButtonClick = () => {
        onRemoveAuthenticator(keyHandle);
    };
    const DropdownDeleteAction = (<DropdownElement onClick={handleOnRemoveButtonClick}>
      <FlexContainer flexDirection="row" flexWrap="nowrap" alignItems="center">
        <TrashIcon sx={{ marginRight: '8px' }} size={16} aria-hidden="true"/>
        <Paragraph size="small" color={colors.dashGreen00} bold>
          {translate(I18N_KEYS.MENU_DELETE)}
        </Paragraph>
      </FlexContainer>
    </DropdownElement>);
    return (<FlexContainer sx={{
            color: colors.black,
            marginTop: '30px',
            width: '100%',
            flexWrap: 'nowrap',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
      <div sx={{ flexGrow: 0, paddingRight: '13px' }}>
        <U2fDeviceIcon color={colors.grey01}/>
      </div>
      <div sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <Paragraph color={colors.grey01} sx={{
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}>
          {name}
        </Paragraph>
        <Paragraph color={colors.grey01} size="x-small">
          {translate(I18N_KEYS.ADDED_DATE, {
            date: translate.shortDate(new Date(timestamp), 'MMM dd, yyyy'),
            time: translate
                .shortDate(new Date(timestamp), 'h:mma')
                .toLowerCase(),
        })}
        </Paragraph>
      </div>
      {isRemoveU2FAuthenticatorAvailable ? (<div sx={{ flexGrow: 0 }}>
          <DropdownMenu offset={[0, 4]} placement="bottom-end" content={DropdownDeleteAction}>
            <IconButton type="button" size="small" aria-label={translate(I18N_KEYS.MENU_TITLE)} title={translate(I18N_KEYS.MENU_TITLE)} icon={<DotsIcon size={20} rotate={90}/>}/>
          </DropdownMenu>
        </div>) : null}
    </FlexContainer>);
};
