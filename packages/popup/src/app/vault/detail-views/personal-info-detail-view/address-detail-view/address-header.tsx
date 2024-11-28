import { memo } from "react";
import { jsx } from "@dashlane/design-system";
import { AddressIcon } from "../../../active-tab-list/lists/personal-info-list/addresses/address-icon";
import { openItemInWebapp } from "../../helpers";
import { Header } from "../../common/header";
interface Props {
  name: string;
  id: string;
  onClose: () => void;
}
const AddressDetailHeaderComponent = ({ name, id, onClose }: Props) => (
  <Header
    Icon={<AddressIcon />}
    title={name}
    onEdit={() => {
      void openItemInWebapp(id, "/personal-info/addresses");
    }}
    onClose={onClose}
  />
);
export const AddressDetailHeader = memo(AddressDetailHeaderComponent);
