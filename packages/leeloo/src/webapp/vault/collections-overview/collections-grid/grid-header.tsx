import { Heading, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
export const GridHeader = () => {
    const { translate } = useTranslate();
    return (<Heading as="h2" textStyle="ds.title.block.medium" color="ds.text.neutral.standard" sx={{
            borderBottom: '1px solid ds.border.neutral.quiet.idle',
            margin: '0 32px',
            padding: '18px 0',
        }}>
      {translate('collections_overview_title')}
    </Heading>);
};
