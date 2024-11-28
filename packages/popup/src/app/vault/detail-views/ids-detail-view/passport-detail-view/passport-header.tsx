import { memo } from "react";
import { jsx } from "@dashlane/design-system";
import { PassportIcon } from "../../../active-tab-list/lists/ids-list/passports-list";
import { openItemInWebapp } from "../../helpers";
import { Header } from "../../common/header";
interface Props {
  name: string;
  id: string;
  onClose: () => void;
}
const PassportHeaderDetailComponent = ({ name, id, onClose }: Props) => (
  <Header
    Icon={<PassportIcon />}
    title={name}
    onEdit={() => {
      void openItemInWebapp(id, "/ids/passports");
    }}
    onClose={onClose}
  />
);
export const PassportDetailHeader = memo(PassportHeaderDetailComponent);
