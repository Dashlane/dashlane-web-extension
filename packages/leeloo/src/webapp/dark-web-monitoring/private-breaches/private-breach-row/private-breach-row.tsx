import { useCallback, useMemo } from 'react';
import { Page } from '@dashlane/hermes';
import { FlexContainer } from '@dashlane/ui-components';
import { Badge, Button, Icon, jsx, Paragraph } from '@dashlane/design-system';
import { BreachItemView, BreachStatus } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { assertUnreachable } from 'libs/assert-unreachable';
import { CredentialInfoSize } from 'libs/dashlane-style/credential-info/credential-info';
import { CredentialThumbnail } from 'libs/dashlane-style/credential-info/credential-thumbnail';
import { logPageView } from 'libs/logs/logEvent';
import { DatePrecision, getBreachDate, } from 'webapp/dark-web-monitoring/helpers/date';
import { getBreachTitle } from 'webapp/dark-web-monitoring/helpers/breach';
import { useBreaches } from 'webapp/dark-web-monitoring/hooks/useBreaches';
import { SX_STYLES } from './private-breach-styles';
export interface PrivateBreachRowProps {
    breachItemView: BreachItemView;
    handleOnViewDetails: (breachItemView: BreachItemView) => void;
}
const I18N_KEYS = {
    BREACH_NEW_BADGE: 'webapp_darkweb_leaks_new_badge',
    ACKNOWLEDGED_STATUS: 'webapp_darkweb_leaks_acknowledged_status',
    BREACHED_DAY_MONTH_YEAR: 'webapp_darkweb_leaks_breached_markup',
    BREACHED_MONTH_YEAR: 'webapp_darkweb_leaks_breached_markup_month_year',
    BREACHED_YEAR: 'webapp_darkweb_leaks_breached_markup_year',
    DELETE_ALERT: 'webapp_darkweb_leaks_view_delete_alert',
    MULTIPLE_EMAILS: 'webapp_darkweb_leaks_view_multiple_emails',
    UNKNOWN_WEBSITE_TITLE: 'webapp_darkweb_leaks_unknown_website_title',
    VIEW_DETAILS_BUTTON: 'webapp_darkweb_leaks_view_details_button',
};
const DEFAULT_THUMBNAIL_TEXT = '?';
type StatusProps = Pick<BreachItemView, 'status' | 'eventDate'>;
const Status = ({ eventDate, status }: StatusProps) => {
    const { translate } = useTranslate();
    const formattedEventDate = useMemo(() => {
        const { date, precision } = getBreachDate(eventDate, 'short', translate);
        switch (precision) {
            case DatePrecision.INVALID:
                return null;
            case DatePrecision.DAY:
                return translate.markup(I18N_KEYS.BREACHED_DAY_MONTH_YEAR, { date });
            case DatePrecision.MONTH:
                return translate(I18N_KEYS.BREACHED_MONTH_YEAR, { date });
            case DatePrecision.YEAR:
                return translate(I18N_KEYS.BREACHED_YEAR, { date });
            default:
                return assertUnreachable(precision);
        }
    }, [eventDate, translate]);
    const iconColor = useMemo(() => {
        switch (status) {
            case BreachStatus.ACKNOWLEDGED:
                return 'ds.text.positive.quiet';
            case BreachStatus.PENDING:
                return 'ds.text.danger.standard';
            default:
                return 'ds.text.neutral.quiet';
        }
    }, [status]);
    return (<div sx={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      <Icon name={status === BreachStatus.ACKNOWLEDGED
            ? 'FeedbackSuccessOutlined'
            : 'FeedbackWarningOutlined'} size="small" color={iconColor}/>
      <Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.quiet">
        {status === BreachStatus.ACKNOWLEDGED
            ? translate(I18N_KEYS.ACKNOWLEDGED_STATUS)
            : formattedEventDate}
      </Paragraph>
    </div>);
};
interface HoverActionsProps {
    onDelete: () => void;
    onView: () => void;
}
const HoverActions = ({ onDelete, onView }: HoverActionsProps) => {
    const { translate } = useTranslate();
    return (<div sx={SX_STYLES.privateBreachActions}>
      <Button mood="neutral" intensity="quiet" layout="labelOnly" color="ds.container.expressive.neutral.quiet.idle" onClick={onView} data-testid="breaches-detail-button">
        {translate(I18N_KEYS.VIEW_DETAILS_BUTTON)}
      </Button>
      <Button mood="danger" intensity="supershy" layout="iconOnly" color="ds.container.expressive.danger.quiet.hover" icon="ActionCloseOutlined" tooltip={translate(I18N_KEYS.DELETE_ALERT)} aria-label={translate(I18N_KEYS.DELETE_ALERT)} onClick={onDelete} data-testid="breaches-delete-button"/>
    </div>);
};
export const PrivateBreachRow = ({ breachItemView, handleOnViewDetails, }: PrivateBreachRowProps) => {
    const { translate } = useTranslate();
    const { dismissBreach } = useBreaches();
    const { domains, eventDate, impactedEmails, status } = breachItemView;
    const breachTitle = useMemo(() => getBreachTitle(breachItemView) ??
        translate(I18N_KEYS.UNKNOWN_WEBSITE_TITLE), [breachItemView, translate]);
    const onViewClick = useCallback(() => {
        logPageView(Page.ToolsDarkWebMonitoringAlert);
        handleOnViewDetails(breachItemView);
    }, [handleOnViewDetails, breachItemView]);
    const onDeleteClick = () => dismissBreach(breachItemView.id);
    return (<li sx={SX_STYLES.privateBreachRow}>
      <div sx={SX_STYLES.privateBreachContent} data-testid="private-breach">
        <div sx={SX_STYLES.privateBreachInfo}>
          <div style={{ marginRight: '16px' }}>
            <CredentialThumbnail domain={domains?.[0]} title={domains?.[0] ?? DEFAULT_THUMBNAIL_TEXT} size={CredentialInfoSize.SMALL}/>
          </div>

          <div sx={SX_STYLES.privateBreachTextInfo}>
            <FlexContainer as="strong" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} gap="4px">
              <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.catchy">
                {breachTitle}
              </Paragraph>
              {breachItemView.status === BreachStatus.PENDING ? (<Badge mood="danger" intensity="quiet" layout="labelOnly" label={translate(I18N_KEYS.BREACH_NEW_BADGE)}/>) : null}
            </FlexContainer>
            {impactedEmails.length > 0 ? (<span sx={SX_STYLES.privateBreachEmail}>
                {impactedEmails.length > 1
                ? translate(I18N_KEYS.MULTIPLE_EMAILS, {
                    count: impactedEmails.length,
                })
                : impactedEmails[0]}
              </span>) : null}
          </div>
        </div>
        <div sx={SX_STYLES.privateBreachDynamicHoverContent}>
          <div sx={{ display: 'none' }}>
            <HoverActions onDelete={onDeleteClick} onView={onViewClick}/>
          </div>
          <div sx={SX_STYLES.privateBreachStatus}>
            <Status eventDate={eventDate} status={status}/>
          </div>
        </div>
      </div>
    </li>);
};
