import { jsx } from '@dashlane/design-system';
import { SpaceAndSharingIconsRow } from 'webapp/components/space-and-sharing-icons/space-and-sharing-icons-row';
interface Props {
    collectionName: string;
    collectionSpaceId: string;
    isShared: boolean;
    isPersonalSpaceDisabled: boolean;
}
export const MenuItemContent = ({ collectionName, collectionSpaceId, isPersonalSpaceDisabled, isShared, }: Props) => {
    return (<SpaceAndSharingIconsRow isShared={isShared} spaceId={isPersonalSpaceDisabled ? undefined : collectionSpaceId}>
      <span sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        }}>
        {collectionName}
      </span>
    </SpaceAndSharingIconsRow>);
};
