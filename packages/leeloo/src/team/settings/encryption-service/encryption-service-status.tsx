import { FlexContainer, LoadingIcon } from '@dashlane/ui-components';
import { Badge, Icon, jsx, Paragraph, Tooltip } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { BlockQuote } from 'libs/dashlane-style/block-quote/block-quote';
import { BasicConfig } from '@dashlane/communication';
import { useTeamDevice } from '../hooks/useTeamDevice';
import { fromUnixTime } from 'date-fns';
import { LOCALE_FORMAT } from 'libs/i18n/helpers';
const I18N_KEYS = {
    ES_CONNECTED: 'team_settings_encryption_service_connected_feedback',
    ES_VERSION: 'team_settings_encryption_service_version',
    ES_REFRESH: 'team_settings_encryption_service_refresh',
    ES_AVAILABLE: 'team_settings_encryption_service_new_version',
    TOOLTIP_INFO: 'team_settings_encryption_service_tooltip_text_markup',
    NOT_AVAILABLE: 'team_settings_encryption_service_not_available',
    ES_LAST_RESTART: 'team_settings_encryption_service_last_restart',
    ES_ERROR: '_common_generic_error',
};
interface EncryptionServiceStatusProps {
    config: BasicConfig;
}
export const EncryptionServiceStatus = ({ config, }: EncryptionServiceStatusProps) => {
    const { translate } = useTranslate();
    const { teamDevice, refreshTeamDevice, teamDeviceLoading } = useTeamDevice(config.deviceAccessKey);
    const ssoTooltipInfoText = translate.markup(I18N_KEYS.TOOLTIP_INFO, {
        updateServiceUrl: '*****',
    }, { linkTarget: '_blank' }, {
        color: 'ds.text.inverse.catchy',
        hoverColor: 'ds.text.brand.quiet',
        activeColor: 'ds.text.brand.standard',
    });
    return (<BlockQuote>
      {teamDeviceLoading ? (<LoadingIcon color="ds.text.brand.standard"/>) : (<FlexContainer flexDirection="column" gap="5px">
          <Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.standard">
            {`${translate(I18N_KEYS.ES_LAST_RESTART)}
                    ${teamDevice?.lastStartDateUnix
                ? fromUnixTime(teamDevice.lastStartDateUnix).toLocaleString(navigator.language, {
                    ...LOCALE_FORMAT.lll,
                    timeZoneName: 'short',
                })
                : translate(I18N_KEYS.NOT_AVAILABLE)}`}
          </Paragraph>
          <FlexContainer gap="8px">
            <Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.standard">
              {`
                   ${translate(I18N_KEYS.ES_VERSION)}
                   ${teamDevice?.version ?? translate(I18N_KEYS.NOT_AVAILABLE)}
                  `}
            </Paragraph>
            {teamDevice?.hasLatestVersion === false ? (<Tooltip wrapTrigger content={ssoTooltipInfoText}>
                <Badge mood="danger" iconName="FeedbackWarningOutlined" layout="iconLeading" label={translate(I18N_KEYS.ES_AVAILABLE)}/>
              </Tooltip>) : null}
          </FlexContainer>
          <Paragraph as="a" color="ds.text.brand.standard" sx={{ textDecoration: 'none', fontWeight: 'normal' }} onClick={() => refreshTeamDevice()} textStyle="ds.body.reduced.regular">
            <Icon sx={{ display: 'inline', marginRight: '5px' }} name="ActionRefreshOutlined" size="xsmall" color="ds.text.brand.standard"/>
            {translate(I18N_KEYS.ES_REFRESH)}
          </Paragraph>
        </FlexContainer>)}
    </BlockQuote>);
};
