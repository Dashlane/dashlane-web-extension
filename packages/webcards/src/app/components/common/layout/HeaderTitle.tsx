import { Heading, jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import DOMPurify from "dompurify";
interface Props {
  title: string;
}
const HEADING_STYLES: Partial<ThemeUIStyleObject> = {
  overflowWrap: "anywhere",
};
export const HeaderTitle = ({ title }: Props) => {
  const sanitizedTitle = DOMPurify.sanitize(title);
  return (
    <Heading
      as="h1"
      color="ds.text.neutral.catchy"
      textStyle="ds.title.block.small"
      dangerouslySetInnerHTML={{ __html: sanitizedTitle }}
      sx={HEADING_STYLES}
      data-testid="header-title"
    />
  );
};
