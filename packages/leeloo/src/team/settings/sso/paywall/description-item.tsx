import { Icon, IconProps, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
    ITEM: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '16px',
    },
};
interface Props {
    iconName: IconProps['name'];
    title: string;
    subtitle: string;
}
export const DescriptionItem = ({ iconName, title, subtitle }: Props) => {
    const { translate } = useTranslate();
    return (<div sx={SX_STYLES.ITEM}>
      <Icon name={iconName} size="xlarge"/>
      <div>
        <Paragraph textStyle="ds.title.block.medium" sx={{ marginBottom: '5px' }}>
          {translate(title)}
        </Paragraph>
        <Paragraph textStyle="ds.body.reduced.regular" color="ds.text.neutral.quiet">
          {translate(subtitle)}
        </Paragraph>
      </div>
    </div>);
};
