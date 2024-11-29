import {
  Icon,
  IconProps,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
const ICON_SIZE = "40px";
const SX_STYLES: Partial<Record<string, ThemeUIStyleObject>> = {
  ITEM: {
    display: "grid",
    gridTemplateColumns: `${ICON_SIZE} 1fr`,
    alignItems: "center",
    gap: "8px",
  },
};
interface Props {
  iconName: IconProps["name"];
  title: string;
}
export const DialogDescriptionItem = ({ iconName, title }: Props) => {
  const { translate } = useTranslate();
  return (
    <div sx={SX_STYLES.ITEM}>
      <div
        sx={{
          borderRadius: "8px",
          backgroundColor: "ds.container.expressive.brand.quiet.disabled",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: ICON_SIZE,
          width: ICON_SIZE,
        }}
      >
        <Icon name={iconName} size="large" color="ds.text.brand.standard" />
      </div>

      <Paragraph textStyle="ds.body.standard.regular">
        {translate(title)}
      </Paragraph>
    </div>
  );
};
