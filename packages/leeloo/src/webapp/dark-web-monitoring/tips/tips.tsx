import { Heading, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import { Card } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    TIPS: 'webapp_darkweb_tips_monitored_tips_title',
    TITLE: 'webapp_darkweb_tips_monitored_tips_base_card_title',
    DESCRIPTION: 'webapp_darkweb_tips_monitored_tips_base_card_description',
};
const DarkWebMonitoringTipsStyles: Record<string, ThemeUIStyleObject> = {
    tips: {
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        border: '1px solid transparent',
        borderColor: 'ds.border.neutral.quiet.idle',
        borderRadius: '4px',
        padding: '32px',
    },
};
export const Tips = () => {
    const { translate } = useTranslate();
    return (<Card sx={DarkWebMonitoringTipsStyles.tips}>
      <Heading as="h2" textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet" sx={{ marginBottom: '24px' }}>
        {translate(I18N_KEYS.TIPS)}
      </Heading>
      <div>
        <Paragraph as="h3" textStyle="ds.title.block.medium" color="ds.text.neutral.catchy" sx={{ lineHeight: '24px', marginBottom: '8px' }}>
          {translate(I18N_KEYS.TITLE)}
        </Paragraph>
        <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.standard">
          {translate(I18N_KEYS.DESCRIPTION)}
        </Paragraph>
      </div>
    </Card>);
};
