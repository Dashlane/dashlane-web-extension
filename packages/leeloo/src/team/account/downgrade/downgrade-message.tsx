import { jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { FooterCard } from '../billing/footer-card';
const I18N_KEYS = {
    CONTENT: 'team_account_discontinued_downgrade_message_markup',
};
export const DownGradeMessage = () => {
    const { translate } = useTranslate();
    return (<FooterCard>
      <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.standard.regular">
        {translate.markup(I18N_KEYS.CONTENT, {}, { linkTarget: '_blank' })}
      </Paragraph>
    </FooterCard>);
};
