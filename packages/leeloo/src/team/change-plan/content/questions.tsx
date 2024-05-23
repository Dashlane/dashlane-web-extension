import { CallToAction, HelpCenterArticleCta, UserCallToActionEvent, UserOpenHelpCenterEvent, } from '@dashlane/hermes';
import { colors, Paragraph } from '@dashlane/ui-components';
import { logEvent } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import * as React from 'react';
import { DASHLANE_CONTACT_FORM, DASHLANE_HELP_CENTER } from 'team/urls';
import { ChangePlanCard } from '../layout/change-plan-card';
const I18N_KEYS = {
    HEADER: 'team_account_teamplan_changeplan_questions_header',
    HELP_CENTER: 'team_account_teamplan_changeplan_questions_help_center_markup',
    SUPPORT: 'team_account_teamplan_changeplan_questions_customer_support_markup',
};
export const Questions = () => {
    const { translate } = useTranslate();
    return (<ChangePlanCard title={<Paragraph bold size="large">
          {translate(I18N_KEYS.HEADER)}
        </Paragraph>}>
      <Paragraph color={colors.grey00} size="small" style={{ marginBottom: '10px' }}>
        {translate.markup(I18N_KEYS.HELP_CENTER, {
            helpCenterUrl: DASHLANE_HELP_CENTER,
        }, {
            linkTarget: '_blank',
            onLinkClicked: () => {
                logEvent(new UserOpenHelpCenterEvent({
                    helpCenterArticleCta: HelpCenterArticleCta.HelpCenter,
                }));
            },
        })}
      </Paragraph>
      <Paragraph size="small" color={colors.grey00}>
        {translate.markup(I18N_KEYS.SUPPORT, {
            customerSupportUrl: DASHLANE_CONTACT_FORM,
        }, {
            linkTarget: '_blank',
            onLinkClicked: () => {
                logEvent(new UserCallToActionEvent({
                    callToActionList: [CallToAction.ContactCustomerSupport],
                    chosenAction: CallToAction.ContactCustomerSupport,
                    hasChosenNoAction: false,
                }));
            },
        })}
      </Paragraph>
    </ChangePlanCard>);
};
