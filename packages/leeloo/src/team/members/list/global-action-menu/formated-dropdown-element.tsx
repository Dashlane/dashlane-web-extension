import { Icon, IconName, Paragraph } from "@dashlane/design-system";
import {
  DropdownElement,
  GridChild,
  GridContainer,
} from "@dashlane/ui-components";
type DropdownItemProps = {
  title: string;
  icon: IconName;
  description?: string;
  onClick: (event: React.MouseEvent) => void;
  key: React.Key;
};
export const FormatedDropdownElement = ({
  title,
  icon,
  description,
  onClick,
  key,
}: DropdownItemProps) => {
  return (
    <DropdownElement
      key={key}
      fullWidth
      onClick={onClick}
      sx={{ height: "auto", textAlign: "left" }}
    >
      <GridContainer
        gap={"4px"}
        gridTemplateColumns={"20px auto"}
        gridTemplateRows={"auto auto"}
      >
        <GridChild>
          <Icon name={icon} size="medium" />
        </GridChild>
        <GridChild>
          <Paragraph as="span" textStyle="ds.body.standard.strong">
            {title}
          </Paragraph>
        </GridChild>
        {description ? (
          <GridChild gridArea={"2 / 2 / 3 / 3"} sx={{ textWrap: "wrap" }}>
            <Paragraph
              as="span"
              color="ds.text.neutral.quiet"
              textStyle="ds.title.block.small"
            >
              {description}
            </Paragraph>
          </GridChild>
        ) : null}
      </GridContainer>
    </DropdownElement>
  );
};
