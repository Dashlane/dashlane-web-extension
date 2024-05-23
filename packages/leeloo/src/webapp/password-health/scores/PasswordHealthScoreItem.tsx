import { jsx, Paragraph } from '@dashlane/design-system';
interface PasswordHealthScoreItemProps {
    value: number;
    label: string;
    color: string;
}
export const PasswordHealthScoreItem = ({ label, value, color, }: PasswordHealthScoreItemProps) => {
    return (<div>
      <Paragraph textStyle="ds.title.block.medium" color="ds.text.neutral.quiet">
        {label}
      </Paragraph>
      <Paragraph textStyle="ds.specialty.spotlight.small" sx={{ color, marginTop: '8px' }}>
        {value}
      </Paragraph>
    </div>);
};
