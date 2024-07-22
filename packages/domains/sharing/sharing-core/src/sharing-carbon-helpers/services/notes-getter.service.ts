import { firstValueFrom } from "rxjs";
import { CarbonLegacyClient, isNote, Note } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
function isNoteArray(x: unknown): x is Note[] {
  return Array.isArray(x) && x.every(isNote);
}
@Injectable()
export class NotesGetterService {
  public constructor(private client: CarbonLegacyClient) {}
  public async getCarbonNotesByItemIds(itemIds: string[]): Promise<Note[]> {
    const {
      queries: { carbonState },
    } = this.client;
    const allNotesFromCarbon = await firstValueFrom(
      carbonState({
        path: "userSession.personalData.notes",
      })
    );
    if (isFailure(allNotesFromCarbon)) {
      throw new Error("Unable to access notes from carbon");
    }
    const allNotes = allNotesFromCarbon.data;
    if (!allNotes) {
      throw new Error("No notes found");
    }
    if (!isNoteArray(allNotes)) {
      throw new Error("Notes are invalid");
    }
    const allNotesById = allNotes.reduce(
      (
        acc: {
          [k: Note["Id"]]: Note;
        },
        curr
      ) => {
        acc[curr.Id] = curr;
        return acc;
      },
      {}
    );
    const notes = itemIds.reduce((acc: Array<Note>, curr) => {
      if (curr in allNotesById) {
        acc.push(allNotesById[curr]);
      }
      return acc;
    }, []);
    return notes;
  }
}
