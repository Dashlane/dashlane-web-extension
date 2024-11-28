import { memo } from "react";
import { jsx } from "@dashlane/design-system";
import { Identity } from "@dashlane/vault-contracts";
import { IdentityIcon } from "../../../active-tab-list/lists/personal-info-list/identities/identity-icon";
import { openItemInWebapp } from "../../helpers";
import { Header } from "../../common/header";
interface IdentityDetailHeaderProps {
  identity: Identity;
  onClose: () => void;
}
const IdentityDetailHeaderComponent = ({
  identity,
  onClose,
}: IdentityDetailHeaderProps) => {
  const { pseudo, lastName, lastName2, middleName, firstName, id } = identity;
  let fullName = [firstName, middleName, lastName, lastName2]
    .filter((namePart) => !!namePart)
    .join(" ");
  if (pseudo) {
    fullName += fullName.length > 0 ? ` (${pseudo})` : `(${pseudo})`;
  }
  return (
    <Header
      Icon={<IdentityIcon />}
      title={fullName}
      onEdit={() => {
        void openItemInWebapp(id, "/personal-info/identities");
      }}
      onClose={onClose}
    />
  );
};
export const IdentityDetailHeader = memo(IdentityDetailHeaderComponent);
