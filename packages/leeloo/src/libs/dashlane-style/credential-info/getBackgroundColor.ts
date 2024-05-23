import color from 'color';
import { colors } from '@dashlane/ui-components';
import { CredentialDetailView, CredentialItemView, } from '@dashlane/communication';
type Credential = CredentialItemView | CredentialDetailView;
type DomainIcon = NonNullable<Credential['domainIcon']>;
type BackgroundColor = DomainIcon['backgroundColor'];
type MainColor = DomainIcon['mainColor'];
type Icon = DomainIcon['urls'][keyof DomainIcon['urls']];
export enum Variant {
    THUMBNAIL = 'thumbnail',
    HEADER = 'header'
}
type Params = {
    backgroundColor?: BackgroundColor;
    mainColor?: MainColor;
    iconSource?: Icon;
    variant?: Variant;
};
const defaultBackgroundColor = colors.dashGreen00;
const SIMILAR_CONTRAST_THRESHOLD = 1.3;
const whiteColor = color('white');
const HEX_COLOR_REGEXP = /^#([0-9A-F]{3}){1,2}$/i;
function ensureProperHexValue(colorHex: string | undefined): string {
    const fullColorHex = colorHex && (colorHex.includes('#') ? colorHex : `#${colorHex}`);
    return fullColorHex && HEX_COLOR_REGEXP.test(fullColorHex)
        ? fullColorHex
        : '';
}
function ensureValidColor(cssValue: string): string {
    if (!cssValue) {
        return cssValue;
    }
    try {
        const closeToWhite = color(cssValue).contrast(whiteColor) <= SIMILAR_CONTRAST_THRESHOLD;
        return closeToWhite ? '' : cssValue;
    }
    catch {
        return '';
    }
}
export function getBackgroundColor({ backgroundColor, mainColor, iconSource, variant = Variant.THUMBNAIL, }: Params): string {
    const cssMainColor = ensureProperHexValue(mainColor);
    const cssBackgroundColor = ensureProperHexValue(backgroundColor);
    if (!iconSource) {
        if (ensureValidColor(cssMainColor)) {
            return cssMainColor;
        }
        if (ensureValidColor(cssBackgroundColor)) {
            return cssBackgroundColor;
        }
        return defaultBackgroundColor;
    }
    if (variant === Variant.HEADER) {
        if (ensureValidColor(cssBackgroundColor)) {
            return cssBackgroundColor;
        }
        if (ensureValidColor(cssMainColor)) {
            return cssMainColor;
        }
        return defaultBackgroundColor;
    }
    if (cssBackgroundColor) {
        return cssBackgroundColor;
    }
    if (cssMainColor) {
        return cssMainColor;
    }
    return defaultBackgroundColor;
}
