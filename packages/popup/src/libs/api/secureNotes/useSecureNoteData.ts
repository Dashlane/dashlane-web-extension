import { useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'src/carbonConnector';
export function useSecureNoteData(noteId: string) {
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getNote,
            queryParam: noteId,
        },
        liveConfig: {
            live: carbonConnector.liveNote,
            liveParam: noteId,
        },
    }, [noteId]);
}
