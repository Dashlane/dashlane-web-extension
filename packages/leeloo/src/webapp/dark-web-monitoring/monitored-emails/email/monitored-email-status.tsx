import { FlexContainer, InfoCircleIcon, jsx, Paragraph, Tooltip, } from '@dashlane/ui-components';
import { DataLeaksEmailStatus } from '@dashlane/password-security-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { Fragment, PropsWithChildren } from 'react';
import { PendingEmailStatusWithTooltips, PendingEmailStatusWithTooltipsProps, } from './pending-email-status-with-tooltips';
const I18N_KEYS = {
    ACTIVE_MONITORING: 'webapp_darkweb_email_active_monitoring',
    DISABLED_MONITORING: 'webapp_darkweb_email_disabled_monitoring',
    PENDING_VERIFICATION: 'webapp_darkweb_email_pending_verification',
    BUSINESS_EMAIL_TOOLTIP: 'webapp_darkweb_bussiness_email_tooltip',
    BUSINESS_EMAIL_INFO_ICON_TEXT: 'webapp_darkweb_bussiness_email_monitoring_info',
};
export type MonitoredEmailStatusProps = PendingEmailStatusWithTooltipsProps & {
    state: DataLeaksEmailStatus;
};
const getStatusText = (state: DataLeaksEmailStatus): string | null => {
    switch (state) {
        case DataLeaksEmailStatus.ACTIVE:
            return I18N_KEYS.ACTIVE_MONITORING;
        case DataLeaksEmailStatus.DISABLED:
            return I18N_KEYS.DISABLED_MONITORING;
        case DataLeaksEmailStatus.PENDING:
            return I18N_KEYS.PENDING_VERIFICATION;
        default:
            return null;
    }
};
const getTextColor = (state: DataLeaksEmailStatus): string => {
    switch (state) {
        case DataLeaksEmailStatus.ACTIVE:
        case DataLeaksEmailStatus.DISABLED:
            return 'ds.text.brand.standard';
        case DataLeaksEmailStatus.PENDING:
            return 'ds.text.warning.quiet';
        default:
            return '';
    }
};
const CantRemoveEmailIconWithTooltip = () => {
    const { translate } = useTranslate();
    return (<Tooltip content={translate(I18N_KEYS.BUSINESS_EMAIL_TOOLTIP)} placement="bottom" data-testid="autoEnroll-tooltip">
      <InfoCircleIcon size={16} data-testid="b2b-auto-enroll-email"/>
    </Tooltip>);
};
const MonitoredEmailStatusText = ({ statusText, textColor, enabledRemoval, }: {
    statusText: string;
    textColor: string;
    enabledRemoval: boolean;
}) => {
    const { translate } = useTranslate();
    return enabledRemoval ? (<Paragraph size="small" sx={{
            color: textColor,
            display: 'flex',
            position: 'relative',
            fontSize: '12px',
            width: 'max-content',
        }}>
      {statusText}
    </Paragraph>) : (<div>
      <Paragraph size="small" sx={{
            display: 'flex',
            position: 'relative',
            width: 'max-content',
            fontSize: '12px',
            color: textColor,
        }}>
        {statusText} • {translate(I18N_KEYS.BUSINESS_EMAIL_INFO_ICON_TEXT)}
      </Paragraph>
    </div>);
};
const MonitoredEmailStatusWrapper = ({ children, enabledRemoval, }: PropsWithChildren<{
    enabledRemoval: boolean;
}>) => {
    return enabledRemoval ? (<>{children}</>) : (<FlexContainer sx={{ gap: '5px' }}>
      {children}
      <CantRemoveEmailIconWithTooltip />
    </FlexContainer>);
};
export const MonitoredEmailStatus = (props: MonitoredEmailStatusProps) => {
    const { translate } = useTranslate();
    const { state, canEmailBeRemoved } = props;
    const statusText = getStatusText(state);
    const notificationProps = {
        textColor: getTextColor(state),
        statusText: statusText ? translate(statusText) : '',
        enabledRemoval: canEmailBeRemoved,
    };
    return (<MonitoredEmailStatusWrapper enabledRemoval={canEmailBeRemoved}>
      {state === DataLeaksEmailStatus.PENDING ? (<PendingEmailStatusWithTooltips {...props}>
          <MonitoredEmailStatusText {...notificationProps}/>
        </PendingEmailStatusWithTooltips>) : (<MonitoredEmailStatusText {...notificationProps}/>)}
    </MonitoredEmailStatusWrapper>);
};
