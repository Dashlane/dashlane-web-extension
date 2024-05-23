import { CredentialDataQuery, CredentialFilterCriterium, CredentialFilterField, NoteDataQuery, NoteFilterCriterium, NoteFilterField, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const createCredentialDataQuery = (dataQueryFields: CredentialFilterCriterium[], spaceId: string | null): CredentialDataQuery => {
    const filterCriteria: CredentialFilterCriterium[] = spaceId === null
        ? []
        : [
            {
                field: 'spaceId',
                value: spaceId,
                type: 'equals',
            },
        ];
    filterCriteria.push(...dataQueryFields);
    return {
        sortToken: {
            sortCriteria: [],
            uniqField: 'id',
        },
        filterToken: {
            filterCriteria,
        },
    };
};
export const createNoteDataQuery = (dataQueryFields: NoteFilterCriterium[], spaceId: string | null): NoteDataQuery => {
    const filterCriteria: NoteFilterCriterium[] = spaceId === null
        ? []
        : [
            {
                field: 'spaceId',
                value: spaceId,
                type: 'equals',
            },
        ];
    filterCriteria.push(...dataQueryFields);
    return {
        sortToken: {
            sortCriteria: [],
            uniqField: 'id',
        },
        filterToken: {
            filterCriteria,
        },
    };
};
export const getItemCount = async (credentialfilterfield: CredentialFilterField, credentialFieldValue: string, notefilterfield: NoteFilterField, noteFieldValue: string, spaceId: string | null) => {
    const credentialItemCount = await carbonConnector.getCredentialsCount(createCredentialDataQuery([
        {
            field: credentialfilterfield,
            value: credentialFieldValue,
            type: 'contains',
        },
    ], spaceId));
    const noteItemCount = await carbonConnector.getNotesCount(createNoteDataQuery([
        {
            field: notefilterfield,
            value: noteFieldValue,
            type: 'contains',
        },
    ], spaceId));
    return credentialItemCount + noteItemCount;
};
