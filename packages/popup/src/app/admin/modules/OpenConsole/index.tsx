import { Button, Icon, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { MODULES_SX_STYLES } from '../modules.styles';
import { openTeamConsole } from '../../../more-tools/helpers';
import { I18N_ADMIN_KEYS } from '../../Admin';
import { SX_STYLES } from './OpenConsole.styles';
export const OpenConsoleModule = () => {
    const { translate } = useTranslate();
    const handleOpenConsole = () => {
        openTeamConsole();
    };
    return (<div sx={MODULES_SX_STYLES.MODULE} data-testid="open-console-module">
      <Icon name="DashboardOutlined" size="xlarge" color="ds.text.neutral.quiet"/>
      <Paragraph textStyle="ds.title.block.medium" as="span" sx={SX_STYLES.TITLE}>
        {translate(I18N_ADMIN_KEYS.OPEN_CONSOLE_TITLE)}
      </Paragraph>
      <Button size="small" onClick={handleOpenConsole}>
        {translate(I18N_ADMIN_KEYS.OPEN_CONSOLE_CTA)}
      </Button>
    </div>);
};
