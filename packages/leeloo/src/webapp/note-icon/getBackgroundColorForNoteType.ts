import { NoteType } from '@dashlane/communication';
import cssVariables from './variables.css';
export default function (noteType: NoteType) {
    return cssVariables['--dashlane-secure-notes-icon-background-' + noteType.toLocaleLowerCase()];
}
