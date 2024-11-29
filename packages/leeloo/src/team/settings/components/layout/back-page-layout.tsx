import { useHistory } from "react-router-dom";
import {
  Badge,
  BadgeProps,
  Button,
  Flex,
  Heading,
  Paragraph,
} from "@dashlane/design-system";
type Props = React.PropsWithChildren<{
  title: string;
  paragraph?: string;
  badge?: BadgeProps;
  showBackButton?: boolean;
  onBackClicked?: () => void;
}>;
export const BackPageLayout = ({
  title,
  paragraph,
  badge,
  children,
  onBackClicked,
  showBackButton = true,
}: Props) => {
  const history = useHistory();
  const navigateBack =
    onBackClicked ??
    (() => {
      history.push(".");
    });
  return (
    <div sx={{ padding: "24px 0" }}>
      <div sx={{ padding: "0 32px" }}>
        <Flex gap="8px" sx={{ marginBottom: "16px" }} alignItems="center">
          {showBackButton}
          <Button
            layout="iconOnly"
            icon="CaretLeftOutlined"
            intensity="supershy"
            mood="neutral"
            onClick={navigateBack}
          />
          <Heading as="h1" textStyle="ds.title.section.large">
            {title}
          </Heading>
          {badge ? <Badge {...badge} /> : null}
        </Flex>
        {paragraph ? (
          <Paragraph sx={{ marginBottom: "32px" }}>{paragraph}</Paragraph>
        ) : null}
      </div>
      {children}
    </div>
  );
};
