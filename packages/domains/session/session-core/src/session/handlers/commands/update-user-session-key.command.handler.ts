import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { CommandSuccess } from "@dashlane/framework-contracts";
import { failure, Result, success } from "@dashlane/framework-types";
import {
  SessionsStateStore,
  SessionStoreMutex,
} from "../../stores/sessions-state.store";
import {
  UnableToUpdateSessionKeyForNonExistingAccount,
  UnableToUpdateSessionSessionNotOpened,
  UpdateUserSessionKeyCommand,
  UpdateUserSessionKeyErrors,
} from "@dashlane/session-contracts";
import { SessionKeyImporter } from "../../services/session-key-importer";
@CommandHandler(UpdateUserSessionKeyCommand)
export class UpdateUserSessionKeyCommandHandler
  implements ICommandHandler<UpdateUserSessionKeyCommand>
{
  constructor(
    private readonly store: SessionsStateStore,
    private readonly importer: SessionKeyImporter
  ) {}
  async execute({
    body: { email, sessionKey },
  }: UpdateUserSessionKeyCommand): Promise<
    Result<CommandSuccess, UpdateUserSessionKeyErrors>
  > {
    const nonExportedSessionKey =
      sessionKey.type === "exported"
        ? await this.importer.import(sessionKey)
        : sessionKey;
    return await SessionStoreMutex.runExclusive(async () => {
      const state = await this.store.getState();
      if (!(email in state)) {
        return failure(new UnableToUpdateSessionKeyForNonExistingAccount());
      }
      const session = state[email];
      if (session.status === "closed") {
        return failure(new UnableToUpdateSessionSessionNotOpened());
      }
      state[email] = {
        status: "open",
        localKey: session.localKey,
        sessionKey: nonExportedSessionKey,
      };
      await this.store.set(state);
      return success(undefined);
    });
  }
}
