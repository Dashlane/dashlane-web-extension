import * as React from "react";
import { Diff } from "utility-types";
import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { Lee } from "../../../lee";
import { GroupList } from "./group-list";
import LoadingSpinner from "../../../libs/dashlane-style/loading-spinner";
import { carbonConnector } from "../../../libs/carbon/connector";
import { connect, Selector } from "../../../libs/carbonApiConsumer";
import { remoteDataAdapter } from "../../../libs/remoteDataAdapter";
interface Props {
  lee: Lee;
  userGroups: UserGroupDownload[];
}
interface InjectedProps {
  userGroups: UserGroupDownload[];
}
type WrapperProps = Diff<Props, InjectedProps>;
const userGroupsSelector: Selector<UserGroupDownload[], WrapperProps, void> = {
  live: carbonConnector.liveAdministrableUserGroups,
  query: carbonConnector.getAdministrableUserGroups,
};
const selectors = {
  userGroups: userGroupsSelector,
};
const remoteDataConfig = {
  strategies: selectors,
  loadingComponent: <LoadingSpinner containerStyle={{ minHeight: 240 }} />,
};
export const Connected = connect(
  remoteDataAdapter<InjectedProps, Props>(GroupList, remoteDataConfig),
  selectors
);
