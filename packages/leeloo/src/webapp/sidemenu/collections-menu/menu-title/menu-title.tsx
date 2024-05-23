import { jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { CreateAction } from './create-action';
export const MenuTitle = () => {
    const { translate } = useTranslate();
    return (<div sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginRight: '8px',
        }}>
      <Paragraph textStyle="ds.title.block.small" color="ds.text.neutral.quiet">
        {translate('webapp_credentials_header_row_category')}
      </Paragraph>
      <CreateAction />
    </div>);
};
