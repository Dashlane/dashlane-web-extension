import { Button, Icon, jsx } from '@dashlane/design-system';
import { DropdownElement, DropdownMenu } from '@dashlane/ui-components';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
const SX_STYLES = {
    LINK: {
        width: '100%',
        fontSize: ' 15px',
        fontStyle: 'normal',
        lineHeight: '20px ',
        color: 'ds.text.neutral.catchy',
    },
    CONTAINER: {
        display: 'flex',
        fontWeight: '400',
        padding: '10px 6px',
        alignItems: 'center',
        gap: '8px',
    },
};
interface Props {
    dropdownItems: Record<string, {
        i18nKey: string;
        url: string;
    }>;
    titleKey: string;
}
export const LearnMoreDropdown = ({ dropdownItems, titleKey }: Props) => {
    const { translate } = useTranslate();
    return (<DropdownMenu sx={{ zIndex: 1001 }} placement="bottom-start" content={Object.keys(dropdownItems).map((item) => (<DropdownElement key={dropdownItems[item].i18nKey} sx={SX_STYLES.LINK} onClick={() => openUrl(dropdownItems[item].url)}>
          <div sx={SX_STYLES.CONTAINER} role="link">
            <Icon name="ActionOpenExternalLinkOutlined" color="ds.text.neutral.catchy"/>
            {translate(dropdownItems[item].i18nKey)}
          </div>
        </DropdownElement>))}>
      <Button mood="brand" intensity="supershy" icon="CaretDownOutlined" layout="iconTrailing">
        {translate(titleKey)}
      </Button>
    </DropdownMenu>);
};
