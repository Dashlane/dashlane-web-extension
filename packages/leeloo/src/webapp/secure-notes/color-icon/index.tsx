import * as React from 'react';
import * as Communication from '@dashlane/communication';
import getBackgroundColorForNoteType from 'webapp/note-icon/getBackgroundColorForNoteType';
import styles from './styles.css';
export const ColorIcon = (noteType: Communication.NoteType) => {
    return (<span className={styles.icon} style={{
            backgroundColor: getBackgroundColorForNoteType(noteType),
        }}/>);
};
