import { UserVerificationUsageLogDetails } from "@dashlane/autofill-engine/types";
import { ReactNode } from "react";
export interface UserVerificationPanelProps {
  readonly onVerificationSucessful: () => void;
  readonly onCancel: () => void;
  readonly makeUserVerificationDialog: (
    content: ReactNode,
    customFooterPart: ReactNode,
    closeWebcard?: (() => Promise<void>) | (() => void),
    onChooseOtherMethodCleanup?: () => void
  ) => JSX.Element;
  readonly usageLogDetails: UserVerificationUsageLogDetails;
  readonly attemptCounter: number;
  readonly incrementAttemptCounter: () => void;
}
