import { jsx, Paragraph, ThemeUIStyleObject } from '@dashlane/design-system';
import { Avatar } from 'libs/dashlane-style/avatar/avatar';
import { LocalizedDateTime } from 'libs/i18n/localizedDateTime';
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    LOGIN_CELL: {
        display: 'flex',
        padding: '15px 16px 14px',
    },
    LOGIN_TEXT: {
        height: '31px',
        marginLeft: '16px',
        maxWidth: '300px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};
import styles from './styles.css';
interface Props {
    login: string;
    date: Date;
    action: JSX.Element | null;
}
export const LogsTableRow = ({ login, action, date }: Props) => {
    return (<tr>
      <td sx={SX_STYLES.LOGIN_CELL}>
        <Avatar email={login} size={30}/>
        <div id="user-email" sx={SX_STYLES.LOGIN_TEXT}>
          <Paragraph color="ds.text.neutral.catchy" textStyle="ds.body.standard.regular">
            {login}
          </Paragraph>
        </div>
      </td>
      <td>{action}</td>
      <td className={styles.dateCell}>
        <LocalizedDateTime date={date}/>
      </td>
    </tr>);
};
