import { memo } from "react";
import { jsx } from "@dashlane/design-system";
import { FiscalIdIcon } from "../../../active-tab-list/lists/ids-list/fiscal-ids-list";
import { openItemInWebapp } from "../../helpers";
import { Header } from "../../common/header";
interface Props {
  name: string;
  id: string;
  onClose: () => void;
}
const FiscalIdDetailHeaderComponent = ({ name, id, onClose }: Props) => (
  <Header
    Icon={<FiscalIdIcon />}
    title={name}
    onEdit={() => {
      void openItemInWebapp(id, "/ids/fiscal-ids");
    }}
    onClose={onClose}
  />
);
export const FiscalIdDetailHeader = memo(FiscalIdDetailHeaderComponent);
