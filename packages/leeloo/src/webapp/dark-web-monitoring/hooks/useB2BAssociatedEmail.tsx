import { DataStatus } from "@dashlane/framework-react";
import { useSpaces } from "../../../libs/carbon/hooks/useSpaces";
export const MAX_MONITORED_EMAIL_SLOTS = 5;
export const useB2BAssociatedEmail = (): string | null => {
  const spaces = useSpaces();
  const b2bAssociatedEmail =
    spaces.status === DataStatus.Success && spaces.data.length > 0
      ? spaces?.data[0].associatedEmail
      : null;
  return b2bAssociatedEmail;
};
