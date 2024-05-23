import { Icon, IconProps, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const SX_STYLES: Partial<Record<string, ThemeUIStyleObject>> = {
    ITEM: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
};
interface Props {
    iconName: IconProps['name'];
    title: string;
    subtitle: string;
}
export const DialogDescriptionItem = ({ iconName, title, subtitle }: Props) => {
    const { translate } = useTranslate();
    return (<div sx={SX_STYLES.ITEM}>
      <Icon name={iconName} size="xlarge"/>
      <div sx={{ padding: '10px' }}>
        <Paragraph textStyle="ds.title.block.medium" sx={{ marginBottom: '5px' }}>
          {translate(title)}
        </Paragraph>
        <Paragraph textStyle="ds.body.reduced.regular">
          {translate(subtitle)}
        </Paragraph>
      </div>
    </div>);
};
