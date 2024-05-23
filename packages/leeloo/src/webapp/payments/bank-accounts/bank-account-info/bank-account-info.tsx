import { colors, jsx, Paragraph } from '@dashlane/design-system';
import { Fragment } from 'react';
import { AllowedThumbnailIcons, Thumbnail } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    BANK_ACCOUNTS_NAME: 'webapp_payment_bankaccounts_list_header_bank_name',
};
export interface BankAccountInfoProps {
    bankAccountName: string;
    bankOwner: string;
}
export const BankAccountInfo = ({ bankAccountName, bankOwner, }: BankAccountInfoProps) => {
    const { translate } = useTranslate();
    return (<>
      <Thumbnail icon={AllowedThumbnailIcons.Bank} text={translate(I18N_KEYS.BANK_ACCOUNTS_NAME)} iconColor={colors.lightTheme.ds.text.brand.quiet} size="small" backgroundColor={colors.lightTheme.ds.container.agnostic.neutral.standard}/>
      <div sx={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '16px',
            maxWidth: '100%',
            overflow: 'hidden',
            paddingRight: '8px',
            '> p': {
                display: 'block',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
            },
        }}>
        <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.catchy">
          {bankAccountName}
        </Paragraph>
        <Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.quiet">
          {bankOwner}
        </Paragraph>
      </div>
    </>);
};
