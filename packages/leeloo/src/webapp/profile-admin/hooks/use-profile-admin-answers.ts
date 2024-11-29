import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import { Answer, profileAdminApi } from "@dashlane/onboarding-contracts";
export type UseProfileAdminAnswers =
  | {
      status: DataStatus.Error;
      saveAnswer: (answer: Answer) => Promise<Result<undefined>>;
    }
  | {
      status: DataStatus.Loading;
      saveAnswer: (answer: Answer) => Promise<Result<undefined>>;
    }
  | {
      status: DataStatus.Success;
      saveAnswer: (answer: Answer) => Promise<Result<undefined>>;
      answers: Answer[];
    };
export const useProfileAdminAnswers = (): UseProfileAdminAnswers => {
  const { data, status } = useModuleQuery(profileAdminApi, "answers");
  const { saveAnswer } = useModuleCommands(profileAdminApi);
  if (status === DataStatus.Loading) {
    return {
      status: DataStatus.Loading,
      saveAnswer,
    };
  }
  if (status === DataStatus.Error) {
    return {
      status: DataStatus.Error,
      saveAnswer,
    };
  }
  return {
    status: DataStatus.Success,
    saveAnswer,
    answers: data.answers,
  };
};
