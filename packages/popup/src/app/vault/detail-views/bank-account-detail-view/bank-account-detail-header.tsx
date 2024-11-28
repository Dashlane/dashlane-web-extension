import { memo } from "react";
import { Flex, jsx } from "@dashlane/design-system";
import { BankIcon } from "@dashlane/ui-components";
import { openItemInWebapp } from "../helpers";
import { Header } from "../common/header";
interface BankAccountDetailHeaderProps {
  name: string;
  id: string;
  onClose: () => void;
}
const BankAccountDetailHeaderComponent = ({
  name,
  id,
  onClose,
}: BankAccountDetailHeaderProps) => (
  <Header
    Icon={
      <Flex
        alignItems="center"
        justifyContent="center"
        sx={{
          borderRadius: "4px",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          height: "32px",
          width: "48px",
          backgroundColor: "ds.background.default",
        }}
      >
        <BankIcon size={20} />
      </Flex>
    }
    title={name}
    onEdit={() => {
      void openItemInWebapp(id, "/bank-accounts");
    }}
    onClose={onClose}
  />
);
export const BankAccountDetailHeader = memo(BankAccountDetailHeaderComponent);
