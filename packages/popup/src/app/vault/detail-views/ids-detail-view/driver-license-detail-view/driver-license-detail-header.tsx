import React, { memo } from "react";
import { DriverLicenseIcon } from "../../../active-tab-list/lists/ids-list/driver-licenses-list";
import { Header } from "../../common/header";
import { openItemInWebapp } from "../../helpers";
interface DriverLicenseDetailHeaderProps {
  name: string;
  id: string;
  onClose: () => void;
}
const DriverLicenseDetailHeaderComponent = ({
  name,
  id,
  onClose,
}: DriverLicenseDetailHeaderProps) => (
  <Header
    Icon={<DriverLicenseIcon />}
    title={name}
    onEdit={() => {
      void openItemInWebapp(id, "/ids/driver-licenses");
    }}
    onClose={onClose}
  />
);
export const DriverLicenseDetailHeader = memo(
  DriverLicenseDetailHeaderComponent
);
