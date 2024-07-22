import { safeCast } from "@dashlane/framework-types";
import { Note } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import {
  CredentialsGetterService,
  NotesGetterService,
  SecretsGetterService,
} from "../../../sharing-carbon-helpers";
import { ShareItemErrorDetails } from "../../store/share-items-errors.store";
import { mapToNoteAttachementsError } from "../commands/common/share-items-mappers";
@Injectable()
export class ShareableItemsService {
  constructor(
    private readonly credentialsGetter: CredentialsGetterService,
    private readonly notesGetter: NotesGetterService,
    private readonly secretsGetter: SecretsGetterService
  ) {}
  public async get(vaultItemIds: string[]) {
    const credentials =
      await this.credentialsGetter.getCarbonCredentialsByItemIds(vaultItemIds);
    const { notes, notesErrors } = await this.getSharableNotes(vaultItemIds);
    const secrets = await this.secretsGetter.getCarbonSecretsByItemIds(
      vaultItemIds
    );
    return { credentials, notes, notesErrors, secrets };
  }
  private async getSharableNotes(vaultItemIds: string[]) {
    const allNotes = await this.notesGetter.getCarbonNotesByItemIds(
      vaultItemIds
    );
    return allNotes.reduce(
      (acc, note) => {
        if (note.Attachments?.length) {
          acc.notesErrors.push(mapToNoteAttachementsError(note));
        } else {
          acc.notes.push(note);
        }
        return acc;
      },
      {
        notes: safeCast<Note[]>([]),
        notesErrors: safeCast<ShareItemErrorDetails[]>([]),
      }
    );
  }
}
