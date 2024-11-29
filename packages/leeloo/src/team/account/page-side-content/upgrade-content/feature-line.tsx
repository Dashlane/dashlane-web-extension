import { ExpressiveIcon, IconName, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface Props {
  iconName: IconName;
  description: string;
}
export const FeatureLine = ({ iconName, description }: Props) => {
  const { translate } = useTranslate();
  return (
    <div sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <ExpressiveIcon name={iconName} mood="brand" size="small" />
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.neutral.quiet"
      >
        {translate(description)}
      </Paragraph>
    </div>
  );
};
