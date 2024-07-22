import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
interface SubmitPassphraseChallengeCommandParams {
  readonly passphraseChallenge: string;
}
export class SubmitPassphraseChallengeCommand extends defineCommand<SubmitPassphraseChallengeCommandParams>(
  {
    scope: UseCaseScope.User,
  }
) {}
