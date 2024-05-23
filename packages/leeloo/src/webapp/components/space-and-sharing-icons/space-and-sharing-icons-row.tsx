import { Fragment, PropsWithChildren } from 'react';
import { Icon, jsx } from '@dashlane/design-system';
import { SpaceIcon } from 'webapp/components/space-and-sharing-icons/space-icon';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
interface Props {
    isShared: boolean;
    spaceId?: string;
    size?: 'small' | 'default';
}
const defaultStyles = {
    gap: '8px',
    svg: {
        flex: '0 0 20px',
        marginRight: 0,
    },
};
export const SpaceAndSharingIconsRow = ({ spaceId, isShared, size = 'default', children, }: PropsWithChildren<Props>) => {
    const { spaceDetails } = useTeamSpaceContext();
    const isSpaceDefined = spaceId !== undefined && spaceDetails;
    const showSpaceIcon = isSpaceDefined && spaceDetails.teamId === spaceId;
    const showSharedIcon = isShared;
    const hasIcons = showSharedIcon || showSpaceIcon;
    if (!hasIcons) {
        return <>{children}</>;
    }
    const showInSmallSize = size === 'small' && !showSpaceIcon;
    const sizeDependentStyles = showInSmallSize ? {} : defaultStyles;
    return (<div sx={{
            display: 'flex',
            alignItems: 'center',
            ...sizeDependentStyles,
        }}>
      {children}
      {showSpaceIcon && (<SpaceIcon space={{
                ...spaceDetails,
                id: spaceDetails.teamId,
                name: spaceDetails.teamName,
            }}/>)}
      {showSharedIcon && (<Icon name="SharedOutlined" size={showInSmallSize ? 'xsmall' : 'medium'}/>)}
    </div>);
};
