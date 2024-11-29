import { Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
export const GuideItemMessage = ({ title }: { title: string }) => {
  const { translate } = useTranslate();
  return (
    <Paragraph textStyle="ds.title.block.medium" color="ds.text.neutral.catchy">
      {translate(title)}
    </Paragraph>
  );
};
