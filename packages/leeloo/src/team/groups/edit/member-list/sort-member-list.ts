import { ascend, compose, prop, sortWith, toLower } from 'ramda';
import { UserDownload } from '@dashlane/sharing/types/serverResponse';
const permissionComparator = ascend(prop('permission'));
const aliasComparator = ascend(compose(toLower, prop('alias')));
const sortMemberList = sortWith<UserDownload>([
    permissionComparator,
    aliasComparator,
]);
export default sortMemberList;
