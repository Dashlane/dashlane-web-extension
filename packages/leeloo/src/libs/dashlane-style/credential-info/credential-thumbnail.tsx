import { colors, jsx } from '@dashlane/design-system';
import { AllowedThumbnailIcons, Thumbnail } from '@dashlane/ui-components';
import { DomainIconType } from '@dashlane/vault-contracts';
import { useMemo } from 'react';
import { useDomainIcons } from 'webapp/credentials/hooks/useDomainIcons';
import { CredentialInfoSize } from './credential-info';
import { getBackgroundColor } from './getBackgroundColor';
export interface CredentialThumbnailProps {
    title: string;
    size: CredentialInfoSize;
    domain?: string;
    nativeIcon?: AllowedThumbnailIcons;
}
function getIconSourceSizeKey(size: CredentialInfoSize): Array<DomainIconType> {
    switch (size) {
        case CredentialInfoSize.XSMALL:
        case CredentialInfoSize.SMALL:
            return ['46x30@2x', '118x98@2x'];
        case CredentialInfoSize.MEDIUM:
            return ['118x98@2x', '46x30@2x'];
        case CredentialInfoSize.LARGE:
            return ['160x106@2x', '118x98@2x'];
    }
}
export const CredentialThumbnail = ({ size = CredentialInfoSize.SMALL, title, domain = '', nativeIcon, }: CredentialThumbnailProps) => {
    const { icon: domainIcon } = useDomainIcons(domain);
    const foundType = getIconSourceSizeKey(size).find((type) => type in (domainIcon?.urls ?? {}));
    const iconSource = foundType ? domainIcon?.urls[foundType] : undefined;
    const backgroundColor = useMemo(() => getBackgroundColor({
        backgroundColor: domainIcon?.backgroundColor,
        mainColor: domainIcon?.mainColor,
        iconSource,
    }), [domainIcon]);
    return (<Thumbnail size={size} text={title} iconSource={iconSource} icon={nativeIcon} iconColor={colors.lightTheme.ds.text.brand.standard} backgroundColor={backgroundColor}/>);
};
