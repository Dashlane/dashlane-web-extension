import { Paragraph } from "@dashlane/design-system";
import { SpaceAndSharingIconsRow } from "../../../components/space-and-sharing-icons/space-and-sharing-icons-row";
interface Props {
  collectionName: string;
  collectionSpaceId: string;
  isShared: boolean;
  isPersonalSpaceDisabled: boolean;
}
export const MenuItemContent = ({
  collectionName,
  collectionSpaceId,
  isPersonalSpaceDisabled,
  isShared,
}: Props) => {
  return (
    <SpaceAndSharingIconsRow
      isShared={isShared}
      spaceId={isPersonalSpaceDisabled ? undefined : collectionSpaceId}
    >
      <Paragraph
        as="span"
        color="ds.text.neutral.catchy"
        textStyle="ds.title.block.medium"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {collectionName}
      </Paragraph>
    </SpaceAndSharingIconsRow>
  );
};
