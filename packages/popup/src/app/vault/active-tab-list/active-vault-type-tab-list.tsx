import React, { FC } from "react";
import { Website } from "../../../store/types";
import {
  TabName,
  useActiveVaultTypeTabContext,
} from "../tabs-bar/active-vault-type-tab-context";
import {
  CredentialListContainer,
  IdsListContainer,
  PaymentsListContainer,
  PersonalInfoListContainer,
  SecureNotesListContainer,
} from "./lists";
interface IProps {
  website: Website;
}
const ActiveVaultTypeTabList: FC<IProps> = ({ website }) => {
  const { activeTabName } = useActiveVaultTypeTabContext();
  const renderActiveTab = () => {
    switch (activeTabName) {
      case TabName.Payments:
        return <PaymentsListContainer />;
      case TabName.Notes:
        return <SecureNotesListContainer />;
      case TabName.PersonalInfo:
        return <PersonalInfoListContainer />;
      case TabName.Ids:
        return <IdsListContainer />;
      case TabName.Passwords:
      default:
        return <CredentialListContainer website={website} />;
    }
  };
  return renderActiveTab();
};
export default ActiveVaultTypeTabList;
