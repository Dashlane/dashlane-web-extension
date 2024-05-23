import { Button, ButtonIntensity, ButtonMood, IconName, IndeterminateLoader, jsx, Paragraph, TextColorToken, } from '@dashlane/design-system';
interface SummaryCardProp {
    title: string;
    titleColor?: TextColorToken;
    subtitle: string;
    action: {
        label: string;
        mood?: ButtonMood;
        intensity?: ButtonIntensity;
        icon?: IconName;
        disabled?: boolean;
        onClick: () => void;
    };
    isLoading?: boolean;
}
const SummaryCard = ({ title, titleColor, subtitle, action, isLoading, }: SummaryCardProp) => {
    return (<div sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px',
            flex: 1,
        }}>
      {isLoading ? (<IndeterminateLoader mood="brand"/>) : (<Paragraph textStyle="ds.specialty.monospace.medium" color={titleColor ?? 'ds.text.neutral.quiet'}>
          {title}
        </Paragraph>)}
      <Paragraph as="h2" textStyle="ds.body.standard.regular" color="ds.text.neutral.quiet">
        {subtitle}
      </Paragraph>
      <Button disabled={action.disabled} mood={action.mood} intensity={action.intensity} onClick={action.onClick} layout="iconTrailing" icon={action.icon}>
        {action.label}
      </Button>
    </div>);
};
export default SummaryCard;
