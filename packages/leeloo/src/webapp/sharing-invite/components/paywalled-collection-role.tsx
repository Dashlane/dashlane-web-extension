import { Icon, jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import { Permission } from '@dashlane/sharing-contracts';
export interface Props {
    labelText: JSX.Element;
    upgradeText?: JSX.Element;
    hasIcon?: boolean;
    isStarterAdmin?: boolean;
    memberPermission?: Permission;
}
const starterContainerStyle: ThemeUIStyleObject = {
    display: 'grid',
    gridTemplateColumns: '0.1fr 1fr',
};
export const PaywalledCollectionRole = ({ labelText, upgradeText, hasIcon, isStarterAdmin, memberPermission, }: Props) => {
    return (<div>
      {isStarterAdmin ? (<div sx={starterContainerStyle}>
          <div>
            {memberPermission !== Permission.Admin && hasIcon ? (<Icon name="PremiumOutlined" color="ds.text.oddity.disabled"/>) : null}
          </div>
          <div>
            {labelText}
            {upgradeText}
          </div>
        </div>) : (<div>{labelText}</div>)}
    </div>);
};
