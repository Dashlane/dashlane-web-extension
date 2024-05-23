import { Icon, IconName, jsx } from '@dashlane/design-system';
interface Props {
    iconName: IconName;
}
export const ListItemIcon = ({ iconName }: Props) => (<div sx={{
        alignItems: 'center',
        borderRadius: '4px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        height: '32px',
        justifyContent: 'center',
        width: '48px',
        backgroundColor: 'white',
    }}>
    <Icon name={iconName}/>
  </div>);
