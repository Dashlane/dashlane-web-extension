import { DSStyleObject, Heading, Icon, IconProps, jsx, Paragraph, } from '@dashlane/design-system';
interface Props {
    title: string;
    subtitle: string;
    iconName: IconProps['name'];
    handleClick: () => void;
}
const SX_STYLES: Record<string, DSStyleObject> = {
    OUTER_CONTAINER: {
        display: 'flex',
        padding: '24px',
        alignItems: 'flex-start',
        flex: '1 0 0',
        borderRadius: '8px',
        border: '1px solid ds.border.neutral.standard.idle',
        background: 'ds.container.agnostic.neutral.supershy',
        '&:hover': {
            borderColor: 'ds.border.neutral.standard.hover',
            cursor: 'pointer',
        },
        '&:active': {
            borderColor: 'ds.border.neutral.standard.active',
            cursor: 'pointer',
        },
    },
    INNER_CONTAINER: {
        display: 'flex',
        paddingBottom: '8px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: '1 0 0',
    },
    ICON: {
        margin: '8px',
    },
    HEADER: {
        marginBottom: '4px',
    },
};
export const PaymentTypeCard = ({ title, subtitle, iconName, handleClick, }: Props) => {
    return (<button sx={SX_STYLES.OUTER_CONTAINER} onClick={handleClick}>
      <div sx={SX_STYLES.INNER_CONTAINER}>
        <Icon name={iconName} color="ds.text.brand.standard" size="xlarge" sx={SX_STYLES.ICON}/>
        <Heading as="h3" color="ds.text.brand.standard" textStyle="ds.title.block.medium" sx={SX_STYLES.HEADER}>
          {title}
        </Heading>
        <Paragraph color="ds.text.neutral.quiet" textStyle="ds.body.reduced.regular">
          {subtitle}
        </Paragraph>
      </div>
    </button>);
};
