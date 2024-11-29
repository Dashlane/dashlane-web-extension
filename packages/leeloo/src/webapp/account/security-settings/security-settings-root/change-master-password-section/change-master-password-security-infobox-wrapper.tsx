import { LeakedMasterPasswordInfobox } from "./leaked-master-password-infobox";
import { WeakMasterPasswordInfobox } from "./weak-master-password-infobox";
import { useWeakMasterPassword } from "../../../../leaked-master-password/hooks/use-weak-master-password";
import { useLeakedMasterPassword } from "../../../../leaked-master-password/hooks/use-leaked-master-password";
const CheckLeakedAndWeakMP = () => {
  const isWeakMasterPassword = useWeakMasterPassword();
  const isLeakedMasterPassword = useLeakedMasterPassword();
  if (isLeakedMasterPassword) {
    return <LeakedMasterPasswordInfobox />;
  }
  if (isWeakMasterPassword) {
    return <WeakMasterPasswordInfobox />;
  }
  return null;
};
export const ChangeMasterPasswordInfoboxWrapper = () => {
  return <CheckLeakedAndWeakMP />;
};
