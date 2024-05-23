import { memo } from 'react';
import { uniqueId } from 'lodash';
import { fromUnixTime } from 'date-fns';
import { MasterPasswordResetDemand } from '@dashlane/communication';
import { jsx, Paragraph, ThemeUIStyleObject } from '@dashlane/design-system';
import { Avatar } from 'libs/dashlane-style/avatar/avatar';
import useTranslate from 'libs/i18n/useTranslate';
import { TableHeader } from 'team/page/table-header';
import acceptButton from './accept-button.svg';
import declineButton from './decline-button.svg';
import styles from './styles.css';
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    TABLE_BODY: {
        tr: {
            boxShadow: 'inset 0 -1px 0 0 ds.border.neutral.quiet.idle',
            height: '60px',
            td: {
                padding: '16px',
                verticalAlign: 'middle',
                variant: 'text.ds.body.reduced.regular',
                color: 'ds.text.neutral.standard',
            },
        },
    },
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
const icons = {
    acceptButton,
    declineButton,
};
const I18N_KEYS = {
    TABLE_HEAD_MEMBER: 'team_master_password_reset_table_head_member',
    TABLE_HEAD_TIME: 'team_master_password_reset_table_head_time',
};
interface Props {
    onAccept: (request: MasterPasswordResetDemand) => void;
    onDecline: (request: MasterPasswordResetDemand) => void;
    dateFormatter: (date: Date) => string;
    requests: MasterPasswordResetDemand[];
}
const ListComponent = ({ onAccept, onDecline, dateFormatter, requests, }: Props) => {
    const { translate } = useTranslate();
    const columns = [
        {
            headerLabel: translate(I18N_KEYS.TABLE_HEAD_MEMBER),
            headerKey: 'member',
        },
        { headerLabel: translate(I18N_KEYS.TABLE_HEAD_TIME), headerKey: 'time' },
        { headerLabel: '', headerKey: 'actions' },
    ];
    return (<table className={styles.table}>
      <TableHeader columns={columns}/>
      <tbody key="table-body" sx={SX_STYLES.TABLE_BODY}>
        {requests.map((request: MasterPasswordResetDemand) => {
            const creationDate = fromUnixTime(request.creationDateUnix);
            const formattedDate = dateFormatter(creationDate);
            return (<tr key={uniqueId()}>
              <td sx={SX_STYLES.LOGIN_CELL}>
                <Avatar email={request.login} size={30}/>
                <div id="user-email" sx={SX_STYLES.LOGIN_TEXT}>
                  <Paragraph color="ds.text.neutral.catchy" textStyle="ds.body.standard.regular">
                    {request.login}
                  </Paragraph>
                </div>
              </td>
              <td className={styles.dateCell}>{formattedDate}</td>
              <td className={styles.actionCell}>
                <img className={styles.button} onClick={() => onDecline(request)} src={icons.declineButton}/>
                <img className={styles.button} onClick={() => onAccept(request)} src={icons.acceptButton}/>
              </td>
            </tr>);
        })}
      </tbody>
    </table>);
};
export const List = memo(ListComponent);
