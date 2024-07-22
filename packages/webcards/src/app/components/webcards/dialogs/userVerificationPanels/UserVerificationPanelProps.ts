import { UserVerificationUsageLogDetails } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { ReactNode } from "react";
export interface UserVerificationPanelProps {
  readonly onVerificationSucessful: () => void;
  readonly onCancel: () => void;
  readonly makeUserVerificationDialog: (
    content: ReactNode,
    customFooterPart: ReactNode
  ) => JSX.Element;
  readonly usageLogDetails: UserVerificationUsageLogDetails;
  readonly attemptCounter: number;
  readonly incrementAttemptCounter: () => void;
}
