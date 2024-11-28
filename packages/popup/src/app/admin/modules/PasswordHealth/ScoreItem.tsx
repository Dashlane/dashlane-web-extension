import { jsx, Paragraph } from "@dashlane/design-system";
import { SX_STYLES } from "./PasswordHealth.styles";
interface ScoreItemProps {
  value: number;
  label: string;
}
export const ScoreItem = ({ label, value }: ScoreItemProps) => {
  return (
    <div>
      <Paragraph
        textStyle="ds.title.block.small"
        color="ds.text.neutral.quiet"
        sx={SX_STYLES.SCORE_LABEL}
      >
        {label}
      </Paragraph>
      <Paragraph
        textStyle="ds.body.standard.strong"
        data-testid={`score-item-${label}`}
      >
        {value}
      </Paragraph>
    </div>
  );
};
