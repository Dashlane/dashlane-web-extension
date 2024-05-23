import React from 'react';
import { GravatarImage } from 'libs/dashlane-style/avatar/gravatar-image';
import { isValidEmail } from 'libs/validators';
import { isUserCurrentlyOnline } from 'libs/url-utils';
import styles from './avatar-styles.css';
export const getFirstTwoCharacters = (name: string) => {
    name = name.trim();
    if (name.length <= 2) {
        return name;
    }
    return name.charAt(0).toUpperCase() + name.slice(1, 2);
};
export type AbbreviatedTextType = 'firstTwoCharacters';
const createAbbreviatedText = (placeholderTextStyle: AbbreviatedTextType, name: string) => {
    switch (placeholderTextStyle) {
        case 'firstTwoCharacters':
            return getFirstTwoCharacters(name);
        default:
            return null;
    }
};
type AvatarStyleOptions = Partial<Pick<React.CSSProperties, 'border'>>;
interface AvatarWithAbbreviatedTextProps {
    email: string;
    placeholderTextType: AbbreviatedTextType;
    avatarSize: number;
    placeholderFontSize?: number;
    avatarStyleOptions?: AvatarStyleOptions;
}
export const AvatarWithAbbreviatedText = ({ email, placeholderTextType, avatarSize, placeholderFontSize, avatarStyleOptions = {}, }: AvatarWithAbbreviatedTextProps) => {
    const { border = '' } = avatarStyleOptions;
    const gravatarImg = isValidEmail(email) ? (<GravatarImage email={email} size={avatarSize}/>) : null;
    return (<div role={gravatarImg !== null ? undefined : 'img'} aria-label={gravatarImg !== null ? undefined : 'blank avatar image'} style={{
            width: avatarSize,
            height: avatarSize,
        }}>
      <div className={styles.placeholderTextAndImgContainer} style={{ border }}>
        <span className={styles.placeholderText} role="presentation" aria-hidden="true" style={{
            fontSize: placeholderFontSize ? `${placeholderFontSize}px` : '',
        }}>
          {placeholderTextType &&
            createAbbreviatedText(placeholderTextType, email)}
        </span>
        {isUserCurrentlyOnline() && gravatarImg ? (<div className={styles.placeholderImg} style={{ border }}>
            {gravatarImg}
          </div>) : null}
      </div>
    </div>);
};
