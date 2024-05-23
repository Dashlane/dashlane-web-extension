import { Heading, Icon, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    EMPTY_VIEW: 'webapp_collections_empty_view',
};
const CollectionEmptyView = () => {
    const { translate } = useTranslate();
    return (<article sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
      <Icon name="FolderOutlined" sx={{ width: '75px', height: 'auto', marginBottom: '25px' }} color="ds.text.neutral.standard"/>
      <Heading as="h2" textStyle="ds.title.section.large" sx={{
            maxWidth: '480px',
            textAlign: 'center',
        }}>
        {translate(I18N_KEYS.EMPTY_VIEW)}
      </Heading>
    </article>);
};
export { CollectionEmptyView };
