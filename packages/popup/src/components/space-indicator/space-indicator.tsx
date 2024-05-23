import * as React from 'react';
import { defaultTheme } from '@dashlane/design-system';
import { useSpacesContext } from 'src/app/vault/spaces-context';
import { useIsPersonalSpaceDisabled } from 'libs/hooks/use-is-personal-space-disabled';
import { DataStatus } from 'libs/api/types';
interface SpaceIndicatorProps {
    className?: string;
    spaceId: string;
}
export const SpaceIndicator = ({ spaceId, className }: SpaceIndicatorProps) => {
    const { getSpace } = useSpacesContext();
    const spaceData = getSpace(spaceId);
    const isPersonalSpaceDisabled = useIsPersonalSpaceDisabled();
    if (isPersonalSpaceDisabled.status !== DataStatus.Success) {
        return null;
    }
    if (!spaceData || isPersonalSpaceDisabled.isDisabled) {
        return null;
    }
    return (<span title={spaceData.displayName}>
      <svg xmlns="*****" xmlnsXlink="*****" viewBox="0 0 18 18" className={className}>
        <g fill="none" fillRule="evenodd">
          <g fillRule="nonzero">
            <path id="a" fill={spaceData.color} fillRule="evenodd" d="M10.667 16H0V5.333L5.333 0H16v10.667z"/>
            <path stroke="#FFF" strokeOpacity=".5" d="M10.46 15.5l5.04-5.04V.5H5.54L.5 5.54v9.96h9.96z"/>
          </g>
          <text fill={defaultTheme.colors.ds.text.inverse.catchy} fontSize="10" fontWeight="bold">
            <tspan x="7.5" y="12" textAnchor="middle" data-testid="space-indicator-letter">
              {spaceData.letter}
            </tspan>
          </text>
        </g>
      </svg>
    </span>);
};
