import { Paragraph, TextColorToken } from "@dashlane/design-system";
import { SX_STYLES } from "./style";
interface Props {
  img: string;
  title: string;
  subtitle: string;
  caps?: boolean;
  titleColor?: TextColorToken;
}
const Step = ({ img, title, subtitle, caps, titleColor }: Props) => (
  <div sx={SX_STYLES.CONTAINER}>
    <img src={img} sx={SX_STYLES.IMG} />
    <Paragraph
      textStyle="ds.title.block.medium"
      color={titleColor}
      sx={{
        marginBottom: "8px",
        textTransform: caps ? "uppercase" : undefined,
      }}
    >
      {title}
    </Paragraph>
    <Paragraph
      color="ds.text.neutral.quiet"
      textStyle="ds.body.reduced.regular"
    >
      {subtitle}
    </Paragraph>
  </div>
);
export default Step;
