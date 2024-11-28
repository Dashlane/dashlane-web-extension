import { memo } from "react";
import { jsx } from "@dashlane/design-system";
import { PhoneIcon } from "../../../active-tab-list/lists/personal-info-list/phones/phone-icon";
import { openItemInWebapp } from "../../helpers";
import { Header } from "../../common/header";
interface Props {
  name: string;
  id: string;
  onClose: () => void;
}
const PhoneDetailHeaderComponent = ({ name, id, onClose }: Props) => (
  <Header
    Icon={<PhoneIcon />}
    title={name}
    onEdit={() => {
      void openItemInWebapp(id, "/personal-info/phones");
    }}
    onClose={onClose}
  />
);
export const PhoneDetailHeader = memo(PhoneDetailHeaderComponent);
