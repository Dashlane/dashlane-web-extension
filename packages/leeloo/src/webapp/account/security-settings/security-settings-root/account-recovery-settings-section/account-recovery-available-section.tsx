import { Fragment } from 'react';
import { Icon, Infobox, jsx, Paragraph } from '@dashlane/design-system';
import { Link } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    ACCOUNT_RECOVERY_TITLE: 'webapp_account_security_settings_account_recovery_section_title',
    ACCOUNT_RECOVERY_DESCRIPTION: 'webapp_account_security_settings_account_recovery_section_description_markup',
    LOADING_DATA: 'webapp_loader_loading',
    NO_ACCOUNT_RECOVERY_METHOD_DESCRIPTION: 'webapp_account_security_settings_account_recovery_section_description_no_method',
    NO_ACCOUNT_RECOVERY_METHOD_WARNING_INFOBOX: 'webapp_account_security_settings_account_recovery_section_warning_info',
    VIEW_OPTIONS: 'webapp_account_security_settings_account_recovery_section_view_options',
};
interface Props {
    recoveryMethodsCount: number;
    openAccountRecoveryPanel: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
export const AccountRecoveryAvailableSection = ({ recoveryMethodsCount, openAccountRecoveryPanel, }: Props) => {
    const { translate } = useTranslate();
    return (<>
      <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.standard" sx={{ marginBottom: '8px' }}>
        {recoveryMethodsCount < 1
            ? translate(I18N_KEYS.NO_ACCOUNT_RECOVERY_METHOD_DESCRIPTION)
            : translate.markup(I18N_KEYS.ACCOUNT_RECOVERY_DESCRIPTION, {
                count: recoveryMethodsCount,
            })}
      </Paragraph>

      {recoveryMethodsCount < 1 ? (<Infobox mood="warning" size="small" title={translate(I18N_KEYS.NO_ACCOUNT_RECOVERY_METHOD_WARNING_INFOBOX)}/>) : null}

      <Link href="#" role="button" color={'ds.text.brand.standard'} onClick={openAccountRecoveryPanel} style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '16px',
            textDecoration: 'none',
        }}>
        <Paragraph textStyle="ds.body.reduced.regular" sx={{
            textDecoration: 'none',
            color: 'ds.text.brand.standard',
            fontWeight: 500,
            marginRight: '5px',
        }}>
          {translate(I18N_KEYS.VIEW_OPTIONS)}
        </Paragraph>
        <span aria-hidden="true">
          <Icon name="ArrowRightOutlined" size="xsmall" color={'ds.text.brand.standard'}/>
        </span>
      </Link>
    </>);
};
