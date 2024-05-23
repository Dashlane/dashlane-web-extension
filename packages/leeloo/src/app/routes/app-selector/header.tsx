import { Badge, Heading, jsx, mergeSx } from '@dashlane/design-system';
import { DLogo } from '@dashlane/ui-components';
import { SX_STYLES } from './styles';
export const Header = () => {
    return (<div sx={{
            height: '116px',
            backgroundColor: 'ds.container.agnostic.neutral.standard',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
      <div sx={mergeSx([SX_STYLES.CONTAINER, SX_STYLES.HEADER])}>
        <div sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            gap: '16px',
        }}>
          <DLogo size={48} color="ds.oddity.brand"/>
          <div sx={{ display: 'flex', flexDirection: 'column' }}>
            <Badge iconName="ToolsOutlined" label="Internal" mood="neutral" intensity="quiet"/>
            <Heading as="h1" textStyle="ds.title.section.large" color="ds.text.neutral.catchy">
              Applications
            </Heading>
          </div>
        </div>
      </div>
    </div>);
};
