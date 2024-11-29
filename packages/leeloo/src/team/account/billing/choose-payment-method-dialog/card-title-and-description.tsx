import { ExpressiveIcon, IconName, Paragraph } from "@dashlane/design-system";
import { GridChild } from "@dashlane/ui-components";
interface Props {
  cardTitle: string;
  cardDescription: string;
  iconName: IconName;
}
export const CardTitleAndDescription = ({
  cardTitle,
  cardDescription,
  iconName,
}: Props) => {
  return (
    <>
      <GridChild sx={{ alignSelf: "center" }}>
        <ExpressiveIcon name={iconName} size="medium" mood="brand" />
      </GridChild>
      <GridChild>
        <Paragraph textStyle="ds.body.standard.strong">{cardTitle}</Paragraph>
        <Paragraph
          textStyle="ds.body.reduced.regular"
          color="ds.text.neutral.quiet"
          sx={{ marginTop: "4px" }}
        >
          {cardDescription}
        </Paragraph>
      </GridChild>
    </>
  );
};
