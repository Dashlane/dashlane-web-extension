import { Diff } from 'utility-types';
import { UserGroupDownload } from '@dashlane/sharing/types/serverResponse';
import { EditGroup, EditGroupProps } from 'team/groups/edit/edit-group';
import { carbonConnector } from 'libs/carbon/connector';
import { connect, Selector } from 'libs/carbonApiConsumer';
import { remoteDataAdapter } from 'libs/remoteDataAdapter';
interface InjectedProps {
    userGroup: UserGroupDownload;
}
type WrapperProps = Diff<EditGroupProps, InjectedProps>;
const param = (props: WrapperProps): string => `{${props.match.params.uuid}}`;
const userGroupSelector: Selector<UserGroupDownload | null | undefined, WrapperProps, string> = {
    live: carbonConnector.liveAdministrableUserGroup,
    liveParam: param,
    query: carbonConnector.getAdministrableUserGroup,
    queryParam: param,
};
const selectors = {
    userGroup: userGroupSelector,
};
const remoteDataConfig = {
    strategies: selectors,
};
export const Connected = connect(remoteDataAdapter<InjectedProps, EditGroupProps>(EditGroup, remoteDataConfig), selectors);
