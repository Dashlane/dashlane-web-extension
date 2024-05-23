import { colors, jsx, Thumbnail } from '@dashlane/ui-components';
import { Credential, isCredential, isNote, Note, Secret, } from '@dashlane/communication';
import { NoteIcon } from 'webapp/note-icon';
import { Icon } from '@dashlane/design-system';
interface ItemLogoProps {
    item: Credential | Note | Secret;
}
export const ItemLogo = ({ item }: ItemLogoProps) => {
    if (isCredential(item)) {
        const iconSource = (item.domainIcon?.urls ?? {})['46x30@2x'] ?? undefined;
        const backgroundColor = (iconSource && item.domainIcon?.backgroundColor) || colors.midGreen02;
        return (<div sx={{ flexShrink: 0 }}>
        <Thumbnail size="small" text={item.Title} iconSource={iconSource} backgroundColor={backgroundColor}/>
      </div>);
    }
    else if (isNote(item)) {
        return (<div sx={{ flexShrink: 0 }}>
        <NoteIcon noteType={item.Type}/>
      </div>);
    }
    else {
        return (<div sx={{ flexShrink: 0 }}>
        <Icon name="RecoveryKeyOutlined" color="ds.text.neutral.quiet"/>
      </div>);
    }
};
