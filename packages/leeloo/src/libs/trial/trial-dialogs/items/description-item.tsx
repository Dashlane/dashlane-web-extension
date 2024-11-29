import {
  ExpressiveIcon,
  IconProps,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import useTranslate from "../../../i18n/useTranslate";
const SX_STYLES: Partial<Record<string, ThemeUIStyleObject>> = {
  ITEM: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
};
interface Props {
  iconName: IconProps["name"];
  title: string;
  subtitle: string;
}
export const DialogDescriptionItem = ({ iconName, title, subtitle }: Props) => {
  const { translate } = useTranslate();
  return (
    <div sx={SX_STYLES.ITEM}>
      <ExpressiveIcon name={iconName} size="medium" mood="brand" />
      <div sx={{ padding: "10px" }}>
        <Paragraph
          textStyle="ds.title.block.medium"
          sx={{ marginBottom: "5px" }}
        >
          {translate(title)}
        </Paragraph>
        <Paragraph textStyle="ds.body.reduced.regular">
          {translate(subtitle)}
        </Paragraph>
      </div>
    </div>
  );
};
